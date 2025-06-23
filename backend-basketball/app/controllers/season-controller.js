
import Season from "../modules/season-schema-module.js";
import League from "../modules/league-schema-module.js";
import { validationResult } from "express-validator";

const seasonControl = {};

seasonControl.create = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }

    const {name,startDate,endDate,leagueId} = req.body;
    try{
        const season = new Season({name,startDate,endDate});
        const league = await League.findById(leagueId);
        console.log(league)
        if(!league){
            return res.status(404).json({error:'League not found'});
        }
        season.leagueId = leagueId;
        await season.save();
        return res.status(201).json(season)
    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Something went wrong'})
    }
}

seasonControl.listseasons = async(req,res)=>{

    try{
        const seasons = await Season.find().populate({ path: 'leagueId', select: 'name' });
        return res.status(200).json(seasons);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

seasonControl.listseasonsById = async(req,res)=>{

     const id = req.params.id;
    try{
        const season = await Season.findById(id)
        return res.status(200).json(season);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

seasonControl.seasonUpdate = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }

    const id = req.params.id;
    const {startDate,endDate,isActive} = req.body;
    try{
    // const league = await League.findById(id);
    //     if(!league){
    //         return res.status(404).json({error:'League not found'});
    //     }
   
        const season = await Season.findByIdAndUpdate(id,{startDate,endDate,isActive},{new:true});
            return res.status(200).json(season);
    }catch(err){
        console.log(err);
        return res.status(500).json({error:'Something went wrong'});
    }

}

seasonControl.seasonRemove = async(req,res)=>{

    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }
    const id = req.params.id;
    try{
         // Here i need to confirm whether this league id does not have any teams  then Only I can delete - seson yet needs to designed

        const season = await Season.findByIdAndDelete(id);
        return res.status(200).json(season);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})
    }
}

export default seasonControl;