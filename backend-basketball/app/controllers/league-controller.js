
import { validationResult } from "express-validator";
import League from "../modules/league-schema-module.js";
import Season from "../modules/season-schema-module.js";

const legaueControl ={};

legaueControl.create = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }

    const {name,country,isActive} = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : null; // used turnery operator

    try{
        const league = await League.create({name,country,logo,isActive});
        return res.status(201).json(league)
    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Something went wrong'})
    }
}

legaueControl.listLeagues = async(req,res)=>{

    try{
        const leagues = await League.find();
        return res.status(200).json(leagues);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

legaueControl.listLeagueById = async(req,res)=>{
    const id = req.params.id
 try{
        const league = await League.findById(id);
        return res.status(200).json(league);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

legaueControl.leagueUpdate = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }

    const id = req.params.id;
    const {name,country,isActive} = req.body;
    const logo = req.file ? `/uploads/${req.file.filename}` : null; // used turnery operator

    try{
        const league = await League.findByIdAndUpdate(id,{name,country,logo,isActive},{new:true});
            return res.status(200).json(league);
    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Something went wrong'});
    }

}

legaueControl.leagueStatusUpdate =async (req,res)=>{
const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }

    const id = req.params.id;
    const {isActive} = req.body;
    
    try{
        const league = await League.findByIdAndUpdate(id,{isActive},{new:true});
        return res.status(200).json(league);
    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Something went wrong'});
    }

}

legaueControl.leagueRemove = async(req,res)=>{

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }
    const id = req.params.id;
    try{
         // Here i need to confirm whether this league id does not have any season linked, then Only I can delete 
        const season = await Season.findOne({leagueId:id});
        if(season){
            return res.status(400).json({error:'League is linked with a season and cannot be deleted'})
        }
        const league = await League.findByIdAndDelete(id);
        return res.status(200).json(league);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

export default legaueControl;