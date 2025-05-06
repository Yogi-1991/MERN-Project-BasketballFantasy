
import { validationResult } from "express-validator";
import Teams from "../modules/team-schema-module.js";

const teamControl = {};

teamControl.create = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors : error.array()});
    }

    const { teamName, homeCity, seasons,leagueId } = req.body;
    const logoImage = req.file ? `/uploads/${req.file.filename}` : null; // used turnery operator
    const userId = req.userId

    const parsedSeasons = typeof seasons === 'string' ? JSON.parse(seasons) : seasons;// // Parse seasons only if it's a string (i.e., from multipart/form-data)

    try{
        for(const season of parsedSeasons){
            const {seasonYear, players} = season;
             for(const playerId of players){
                const existingTeam = await Teams.findOne({seasons:{$elemMatch:{seasonYear:seasonYear,players:playerId}}});
                if (existingTeam) {
                    return res.status(400).json({error: `Player ${playerId} is already assigned to a team for season ${seasonYear}`});
                  }
             }
        }
        
        const team = await Teams.create({teamName,logoImage, homeCity, seasons:parsedSeasons,leagueId,createdBy:userId});
        console.log(team)
        return res.status(201).json(team);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
    
}

teamControl.addPlayerToTeamSeason = async(req,res)=>{
    const { teamId, seasonYear, playerId } = req.body;

  try {
    // Validate if player is already in a team for that season
    const existingTeam = await Teams.findOne({seasons:{$elemMatch:{seasonYear: seasonYear,players: playerId}}});

    if (existingTeam) {
      return res.status(400).json({error: `Player is already assigned to a team for season ${seasonYear}`});
    }

    // Add the player to the specific season's player list
    const updatedTeam = await Teams.findOneAndUpdate({_id: teamId,'seasons.seasonYear':seasonYear},{$push:{'seasons.$.players': playerId}},{ new: true });

    if (!updatedTeam) {
      return res.status(404).json({ error: 'Team or season not found' });
    }

    return res.status(200).json(updatedTeam);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};


teamControl.listTeams = async(req,res)=>{
    try{
        const teams = await Teams.find().select('teamName homeCity')
        if(teams){
            return res.status(200).json(teams);
        }else{
            return res.status(404).json({error:'No teams found'});
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
}

teamControl.listTeamsByLeague = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors :error.array()});
    }
 const {id} = req.params;
 console.log(req.params)
 try{
    const teams = await Teams.find({leagueId: id})
    if(teams.length ===0){
        return res.status(404).json({error:'No teams found for this league'});
    }
    return res.status(200).json(teams);
 }catch(err){
    console.log(err)
    return res.status(500).json({error:'Something went wrong'});
 }
}

teamControl.teamUpdate = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }
    const userId = req.userId;
    const {id} = req.params;
    const {teamName, homeCity, seasons,leagueId } = req.body;
    const logoImage = req.file ? `/uploads/${req.file.filename}` : null;

    const parsedSeasons = typeof seasons === 'string' ? JSON.parse(seasons) : seasons;
    
    try{
        const team = await Teams.findByIdAndUpdate({_id:id},{teamName,logoImage, homeCity, seasons:parsedSeasons,leagueId,updatedBy:userId},{new:true});
        return res.status(200).json(team);
    }catch(err){
        console.log(err)
        return res.status(500).json({error: 'Something went wrong'});
    }

}

teamControl.teamRemove = async(req,res)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
    return res.status(400).json({errors:error.array()});
 }
 const {id} = req.params;
 try{
    const team = await Teams.findByIdAndDelete(id)
    return res.status(200).json(team);
 }catch(err){
    return res.status(500).json({error: 'Something went wrong'});
 }

}

export default teamControl;