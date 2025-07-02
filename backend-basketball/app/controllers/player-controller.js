import { validationResult } from "express-validator";
import Player from "../modules/player-schema-module.js";
import Schedule from "../modules/schedule-schema-module.js";

const playerControl = {};

// playerControl.create = async(req,res)=>{
//     const error = validationResult(req);
//     if(!error.isEmpty()){
//         return res.status(400).json({errors : error.array()});
//     }

//     const { firstName, lastName, position,jerseyNumber,height,weight,nationality,birthdate ,credit,isActive} = req.body;
//     const profileImage = req.file ? `/uploads/${req.file.filename}` : null; // used turnery operator
//     const userId = req.userId

//     try{
//         const playerExsists = await Player.findOne({firstName:firstName,lastName:lastName});
//         if(playerExsists){
//             return res.status(400).json({notice:`${firstName} ${lastName} already exist in the Database` })
//         }
//         const player = await Player.create({firstName, lastName,profileImage, position,jerseyNumber,height,weight,nationality,birthdate ,isActive,credit,createdBy:userId});
//         console.log(player)
//         return res.status(201).json(player);
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({error: 'Something went wrong'});
//     }
    
// }

playerControl.createPlayer = async (req, res) => {
  const { firstName, lastName, position, jerseyNumber, height, weight, nationality, birthdate, credit, isActive, teamId, seasonYear } = req.body;
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
  const userId = req.userId;

  try {
    // Check if player with same name exists for same team & season
    const existingPlayer = await Player.findOne({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      teamId,
      seasonYear
    });

    if (existingPlayer) {
      return res.status(400).json({
        error: `${firstName} ${lastName} already exists in this team for the selected season.`,
      });
    }

    const player = await Player.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      position,
      jerseyNumber,
      height,
      weight,
      nationality,
      birthdate,
      credit,
      profileImage,
      isActive: isActive !== undefined ? isActive : true,
      teamId,
      seasonYear,
      createdBy: userId,
    });

    return res.status(201).json(player);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};


playerControl.getPlayersByTeamSeason = async(req,res)=>{


    const { teamId, seasonId } = req.params;

  try {
    const players = await Player.find({ teamId, seasonYear: seasonId })
      .populate('teamId', 'teamName')
      .populate('seasonYear', 'name')
    //   .select('-__v');

    res.status(200).json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch players' });
  }

    // try{
    //     const players = await Player.find();
    //     if(players){
    //         return res.status(200).json(players);
    //     }else{
    //         return res.status(404).json({error:'No players found'});
    //     }
    // }
    // catch(err){
    //     console.log(err);
    //     return res.status(500).json({error: 'Something went wrong'});
    // }
}

playerControl.listplayersById = async(req,res)=>{
//     const error = validationResult(req);
//     if(!error.isEmpty()){
//         return res.status(400).json({errors :error.array()});
//     }
//  const {playerId} = req.params;
//  console.log(req.params)
//  try{
//     const player = await Player.find({_id: id})
//     if(player.length ===0){
//         return res.status(404).json({error:'No players found for this league'});
//     }
//     return res.status(200).json(player);
//  }catch(err){
//     console.log(err)
//     return res.status(500).json({error:'Something went wrong'});
//  }

try {
    const { id } = req.params;

    const player = await Player.findById({_id:id})
      .populate('teamId', 'teamName') // optional: to return team name if needed
      .populate('seasonYear', 'name'); // optional: if your Player model has seasonYear

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    return res.status(200).json(player);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}

playerControl.playerUpdate = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }
    const userId = req.userId;
    const {id} = req.params;
    const {firstName, lastName, position,jerseyNumber,height,weight,nationality,birthdate ,credit,isActive} = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
   
    try{
        const player = await Player.findByIdAndUpdate({_id:id},{firstName, lastName,profileImage, position,jerseyNumber,height,weight,nationality,birthdate ,credit,isActive,updatedBy:userId},{new:true});
        return res.status(200).json(player);
    }catch(err){
        console.log(err)
        return res.status(500).json({error: 'Something went wrong'});
    }

}


playerControl.getPlayersByMatch = async (req, res) => {
  
  try {
    const { id } = req.params;

    const match = await Schedule.findById(id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const [homePlayers, awayPlayers] = await Promise.all([
      Player.find({ teamId: match.homeTeam, seasonYear: match.seasonYear }),
      Player.find({ teamId: match.awayTeam, seasonYear: match.seasonYear }),
    ]);

    res.json({
      home: homePlayers,
      away: awayPlayers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch players for match' });
  }
};


playerControl.playerRemove = async(req,res)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
    return res.status(400).json({errors:error.array()});
 }
 const {id} = req.params;
 try{
    const player = await Player.findByIdAndDelete(id)
    if (!player) return res.status(404).json({ error: 'Player not found' });
    return res.status(200).json(player);
 }catch(err){
    console.error(err);
    return res.status(500).json({error: 'Something went wrong'});
 }

}

export default playerControl;