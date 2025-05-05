
import { validationResult } from "express-validator";
import player from "../modules/player-schema-module.js";

const playerControl = {};

playerControl.create = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors : error.array()});
    }

    const { playerName, homeCity, seasons,leagueId } = req.body;
    const logoImage = req.file ? `/uploads/${req.file.filename}` : null; // used turnery operator
    const userId = req.userId

    const parsedSeasons = typeof seasons === 'string' ? JSON.parse(seasons) : seasons;// // Parse seasons only if it's a string (i.e., from multipart/form-data)

    try{
        const player = await players.create({teamName,logoImage, homeCity, seasons:parsedSeasons,leagueId,createdBy:userId});
        console.log(player)
        return res.status(201).json(player);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
    
}

playerControl.listplayers = async(req,res)=>{
    try{
        const players = await players.find().select('teamName homeCity')
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
    const players = await players.find({leagueId: id})
    if(players.length ===0){
        return res.status(404).json({error:'No players found for this league'});
    }
    return res.status(200).json(players);
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
    const {teamName, homeCity, seasons,leagueId } = req.body;
    const logoImage = req.file ? `/uploads/${req.file.filename}` : null;

    const parsedSeasons = typeof seasons === 'string' ? JSON.parse(seasons) : seasons;
    
    try{
        const player = await players.findByIdAndUpdate({_id:id},{teamName,logoImage, homeCity, seasons:parsedSeasons,leagueId,updatedBy:userId},{new:true});
        return res.status(200).json(team);
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
    const player = await players.findByIdAndDelete(id)
    return res.status(200).json(player);
 }catch(err){
    return res.status(500).json({error: 'Something went wrong'});
 }

}

export default playerControl;