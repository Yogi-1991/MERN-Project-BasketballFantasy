
import { validationResult } from "express-validator";
import FantasyTeams from "../modules/fantasyTeam-schema-module.js";
import Player from "../modules/player-schema-module.js";
import Schedule from "../modules/schedule-schema-module.js";
import Contest from "../modules/contest-schema-module.js";


const fantasyTeamControl = {};

fantasyTeamControl.createFantasyTeam = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()})
    }

    const {gameId,teamName, players} = req.body;
    const userId = req.userId;

    try{
    const schedule = await Schedule.findById(gameId); 
        if (!schedule) {
            return res.status(404).json({ notice: 'Match not found.' });
        }

    const now = new Date();
    const matchStartTime = new Date(schedule.matchDate); 

    if (now >= matchStartTime) {
            return res.status(400).json({ notice: 'Cannot create team after match has started.' });
        }

     // checking player count
    if(players.length !== 8){
        return res.status(400).json({notice:'8 players needs to be selected for the fantasy team creation'})
    }
     //checking the captians and voice captian
    const captain = players.filter((p)=>{
        return p.isCaptain == true
    })
    if(captain.length !== 1){
        return res.status(400).json({notice:'one captain must be selected'})
    }
    const viceCaptain = players.filter((p)=>{
        return p.isViceCaptain == true
    })
    if(viceCaptain.length !==1){
        return res.status(400).json({notice:'one voice captain must be selected'});
    }
    //checking any duplicates
    const playerIds = players.map((p)=>{
        return p.playerId.toString();
    })
    const uniqueId = playerIds.filter((id, index)=>{
            return playerIds.indexOf(id) === index;
    })
    if(uniqueId.length!==8){
        return res.status(400).json({notice:'Duplicate players selected'});
    }
 
     //checking whether user already created the team
     const existingTeam = await FantasyTeams.findOne({userId:userId, gameId:gameId})
     if(existingTeam){
         return res.status(400).json({notice:'You have already created a team for this game'})
     }
 
     //checking player exists in the DB
     const playerCheckDb = players.map(p => p.playerId);
     const dbPlayers = await Player.find({ _id: { $in: playerCheckDb } });
     if (dbPlayers.length !== 8) {
       return res.status(400).json({ message: 'Some player IDs are invalid.' });
     }
 
     //getting credit of each player
     let totalCreditsUsed = 0; 
     for(const p of players){
        const playerData = dbPlayers.find((dbp)=>{
            return dbp._id.toString() === p.playerId
        })
        totalCreditsUsed = totalCreditsUsed+ playerData.credit;
     }
 
     if (totalCreditsUsed > 100) {
         return res.status(400).json({ notice: 'Total credits used exceeds 100.' });
       }
 
       const fantasyTeam = await FantasyTeams.create({userId,gameId,teamName,players,totalCreditsUsed });  
   
       return res.status(201).json(fantasyTeam);

 }catch(err){
    console.log(err);
    return res.status(500).json({error:'Something went wrong'});
 }
   
}

fantasyTeamControl.updateFantasyTeam = async (req, res) => {
     const error = validationResult(req);
        if (!error.isEmpty()) {
          return res.status(400).json({ errors: error.array() });
        }
      
        const { gameId,teamName, players } = req.body;
        const userId = req.userId;
      
        if (players.length !== 8) {
          return res.status(400).json({ notice: 'You must select exactly 8 players.' });
        }
      
        //checking the captians and voice captian
         const captain = players.filter((p)=>{
                 return p.isCaptain == true
                 })
        if(captain.length !== 1){
                return res.status(400).json({notice:'one captain must be selected'})
             }
        const viceCaptain = players.filter((p)=>{
                return p.isViceCaptain == true
            })
        if(viceCaptain.length !==1){
             return res.status(400).json({notice:'one voice captain must be selected'});
        }
      
        const playerIds = players.map(p => p.playerId.toString());
        const uniqueIds = players.filter((id,index)=>{
            return players.indexOf(id) === index;
        })
        if (uniqueIds.length !== 8) {
          return res.status(400).json({ notice: 'Duplicate players selected.' });
        }
      
        try {
          // Check match start time
          const schedule = await Schedule.findById(gameId); 
                 if (!schedule) {
                        return res.status(404).json({ notice: 'Match not found.' });
                    }

            const now = new Date();
            const matchStartTime = new Date(schedule.matchDate); 

            if (now >= matchStartTime) {
                 return res.status(400).json({ notice: 'Cannot create team after match has started.' });
                 }
      
          const existingTeam = await FantasyTeams.findOne({ userId, gameId });
                if (!existingTeam) {
                         return res.status(404).json({ notice: 'Fantasy team not found to update.' });
                }
      
          const dbPlayers = await Player.find({ _id: { $in: playerIds } });
                if (dbPlayers.length !== 8) {
                         return res.status(400).json({ notice: 'Some player IDs are invalid.' });
                 }
      
            let totalCreditsUsed = 0; 
                 for(const p of players){
                    const playerData = dbPlayers.find((dbp)=>{
                        return dbp._id.toString() === p.playerId
                    })
                totalCreditsUsed = totalCreditsUsed+ playerData.credit;
                 }
             
            if (totalCreditsUsed > 100) {
                 return res.status(400).json({ notice: 'Total credits used exceeds 100.' });
                 }
          
          existingTeam.teamName = teamName;
          existingTeam.players = players;
          existingTeam.totalCreditsUsed = totalCreditsUsed;
      
          const updatedFantasyTeam = await existingTeam.save();
      
          return res.status(200).json(updatedFantasyTeam);
      
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Something went wrong' });
        }
      }

      fantasyTeamControl.myteams = async(req,res)=>{

        try {
            const gameId = req.query.gameId;
            if (!gameId) {
              return res.status(400).json({ error: 'gameId is required' });
            }
        
            const team = await FantasyTeams.findOne({
              userId: req.user.id,
              gameId: gameId
            }).populate({
                path: 'players.playerId',
                select: 'name position teamId',
                populate: {
                  path: 'teamId',
                  model: 'Teams',
                  select: 'teamName logoImage homeCity'
                }
              });
        
            if (!team) return res.status(404).json({ error: 'No team found' });
        
            res.json(team);
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
          }
        };

        // try{
        //     const userId = req.userId;
        //     const fantasyTeams = await FantasyTeams.find({userId:userId});
        //     if(fantasyTeams.length === 0){
        //         return res.status(404).json({notice: "No teams created yet"});
        //     }
        //     return res.status(200).json(fantasyTeams)
        // }catch(err){
        //     return res.status(500).json({error:'Somehting went wrong'});
        // }
      

      fantasyTeamControl.myContest = async(req,res)=>{
        try{
            const contest = await Contest.find({userId:req.userId});
             if(contest.length ===0){
                return res.status(404).json({notice:'not joined to the contest Yet'});
             }
             return res.status(200).json(contest);
        }catch(err){
            console.log(err);
            return res.status(500).json({error:'Something went wrong'});
        }
      }


export default fantasyTeamControl;