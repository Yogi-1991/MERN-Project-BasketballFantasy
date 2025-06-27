import { validationResult } from "express-validator";
import Player from "../modules/player-schema-module.js";

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


playerControl.listplayers = async(req,res)=>{
    try{
        const players = await Player.find();
        if(players){
            return res.status(200).json(players);
        }else{
            return res.status(404).json({error:'No players found'});
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
}

playerControl.listplayersById = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors :error.array()});
    }
 const {id} = req.params;
 console.log(req.params)
 try{
    const player = await Player.find({_id: id})
    if(player.length ===0){
        return res.status(404).json({error:'No players found for this league'});
    }
    return res.status(200).json(player);
 }catch(err){
    console.log(err)
    return res.status(500).json({error:'Something went wrong'});
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

playerControl.playerRemove = async(req,res)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
    return res.status(400).json({errors:error.array()});
 }
 const {id} = req.params;
 try{
    const player = await Player.findByIdAndDelete(id)
    return res.status(200).json(player);
 }catch(err){
    return res.status(500).json({error: 'Something went wrong'});
 }

}

export default playerControl;