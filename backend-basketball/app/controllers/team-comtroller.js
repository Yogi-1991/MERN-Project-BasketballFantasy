
import { validationResult } from "express-validator";
import Teams from "../modules/team-schema-module.js";
import Player from "../modules/player-schema-module.js";

const teamControl = {};

teamControl.create = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors : error.array()});
    }

    const { teamName, homeCity, seasons,leagueId } = req.body;
    const logoImage = req.file ? `/uploads/${req.file.filename}` : null; // used turnery operator
    const userId = req.userId;

    const parsedSeasons = typeof seasons === 'string' ? JSON.parse(seasons) : seasons;// // Parse seasons only if it's a string (i.e., from multipart/form-data)

    try{
        const teamNameExsits = await Teams.findOne({teamName:teamName});
        if(teamNameExsits){
            return res.status(400).json({error:`Team name ${teamName} already exists in the Database`})
        }
        for(const season of parsedSeasons){
            const {seasonYear, players} = season;

            if (!players || !Array.isArray(players)) continue;

             for(const playerId of players){
                const existingTeam = await Teams.findOne({seasons:{$elemMatch:{seasonYear:seasonYear,players:playerId}}});
                if (existingTeam) {
                    return res.status(400).json({error: `Player ${playerId} is already assigned to a team for season ${seasonYear}`});
                  }
                const notFromPlayers = await Player.findOne({_id:playerId});
                if(!notFromPlayers){
                    return res.status(400).json({error:`Player profile not found for the player ID ${playerId}`})
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

    const notFromPlayers = await Player.find({_id:playerId});
    console.log(notFromPlayers);
    if(notFromPlayers.length==0){
        return res.status(400).json({error:`Player profile not found for the player ID ${playerId}`})
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
        const teams = await Teams.find()
        .populate({ path: 'leagueId', select: 'name' })
        .populate({ path: 'seasons.seasonYear', select: 'name' });
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


teamControl.listTeamsById  = async(req,res)=>{
    const id = req.params.id
    try{
        const teams = await Teams.findById(id)
        .populate({ path: 'leagueId', select: 'name' })
        .populate({ path: 'seasons.seasonYear', select: 'name' });
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


// teamControl.teamUpdate = async (req, res) => {
//   const error = validationResult(req);
//   if (!error.isEmpty()) {
//     return res.status(400).json({ errors: error.array() });
//   }

//   const userId = req.userId;
//   const { id } = req.params;
//   console.log("req.body",req.body)
//   const { teamName, homeCity, coachName } = req.body;
//   const logoImage = req.file ? `/uploads/${req.file.filename}` : null;

//   try {
//     const team = await Teams.findById(id);
//     if (!team) {
//       return res.status(404).json({ error: 'Team not found' });
//     }

//     team.teamName = teamName;
//     team.homeCity = homeCity;
//     team.updatedBy = userId;

//     if (logoImage) {
//       team.logoImage = logoImage;
//     }

//     // Only update the coachName for the latest/first season entry
//     if (team.seasons && team.seasons.length > 0) {
//       team.seasons[0].coachName = coachName;
//     }

//     await team.save();

//     return res.status(200).json(team);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'Something went wrong' });
//   }
// };


teamControl.teamUpdate = async (req, res) => {
  const { id } = req.params;
  const { teamName, homeCity, coachName, seasonId } = req.body;
  const userId = req.userId;

  if (!teamName || !homeCity) {
    return res.status(400).json({ error: 'Team name and home city are required' });
  }

  const logoImage = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const team = await Teams.findById(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    //  Update basic fields
    team.teamName = teamName;
    team.homeCity = homeCity;
    if (logoImage) {
      team.logoImage = logoImage;
    }
    team.updatedBy = userId;

    // Optional: update coachName if seasonId provided
    if (seasonId && coachName !== undefined) {
      const seasonEntry = team.seasons.find((s) => s.seasonYear.toString() === seasonId);
      if (seasonEntry) {
        seasonEntry.coachName = coachName;
      } else {
        return res.status(400).json({ error: 'Season not found in this team' });
      }
    }

    await team.save();

    return res.status(200).json(team);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};



teamControl.teamSeasonUpdate = async (req, res) => {
  const { id } = req.params;
  const { seasonYear, coachName } = req.body;
  const userId = req.userId;

  try {
    const team = await Teams.findById(id);
    if (!team) return res.status(404).json({ error: 'Team not found' });

    // Add new season object
    team.seasons.push({ seasonYear, coachName });
    team.updatedBy = userId;

    await team.save();
    const populatedTeam = await Teams.findById(id)
      .populate({ path: 'leagueId', select: 'name' })
      .populate({ path: 'seasons.seasonYear', select: 'name isActive' });

    res.status(200).json(populatedTeam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add season' });
  }
};


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

teamControl.teamPlayerRemove = async(req,res)=>{
    
    
    const {teamId} = req.params;
    const {seasonYear,playerId} = req.body;

    try{
        const team = await Teams.findById(teamId);
    if(!team){
        return res.status(404).json({notice:'Team not found'})
    }
    const season = team.seasons.find((s)=>{
        return s.seasonYear.toString() === seasonYear;
    })
    if(!season){
        return res.status(404).json({notice: 'season not found'})
    }

    const player = season.players.find((p)=>{
        return p?.toString() === playerId;
    })
    if(!player){
        return res.status(404).json({notice: 'Player not found'})

    }

    // Remove player from season.players
    season.players = season.players.filter((p)=>{
         p.playerId?.toString() !== playerId;
    })
    await team.save();
    return res.status(200).json(team)

    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Something went wrong'});
    }
    
}

export default teamControl;