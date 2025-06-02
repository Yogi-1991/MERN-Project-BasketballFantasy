import Schedule from "../modules/schedule-schema-module.js";
import { validationResult } from "express-validator";
import Teams from "../modules/team-schema-module.js";


const scheduleControl = {};

scheduleControl.create = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors : error.array()});
    }
 
    const { seasonYear, matchDate, homeTeam, awayTeam, venue, status, homeTeamScore, awayTeamScore, attendance, periodScores } = req.body;
    const userId = req.userId

    try{
        const schedule = await Schedule.create({seasonYear, matchDate, homeTeam, awayTeam, venue, status, homeTeamScore, awayTeamScore, attendance, periodScores,createdBy:userId});
        console.log(schedule)
        return res.status(201).json(schedule);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
    
}

scheduleControl.listschedules = async(req,res)=>{
    try{
        const schedule = await Schedule.find();
        if(schedule){
            return res.status(200).json(schedule);
        }else{
            return res.status(404).json({error:'No schedules found'});
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
}

scheduleControl.upcomingSchedule = async (req, res) => {
      
    const now = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(now.getDate() + 2);

    try {
      const schedules = await Schedule.find({ matchDate: {  $gte: now,$lte: twoDaysLater } })
        .populate('homeTeam', 'teamName logoImage')  
        .populate('awayTeam', 'teamName logoImage'); 
  
      if (schedules.length === 0) {
        return res.status(404).json({ error: "Data not found" });
      }
  
      return res.status(200).json(schedules);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  };
  

scheduleControl.listschedulesById = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors :error.array()});
    }
 const {id} = req.params;
 console.log(req.params)
 try{
    const schedule = await Schedule.find({_id: id})
    if(schedule.length ===0){
        return res.status(404).json({error:'No schedule found for this league'});
    }
    return res.status(200).json(schedule);
 }catch(err){
    console.log(err)
    return res.status(500).json({error:'Something went wrong'});
 }
}

scheduleControl.scheduleUpdate = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }
    const userId = req.userId;
    const {id} = req.params;  
    const { seasonYear, matchDate, homeTeam, awayTeam, venue, status, homeTeamScore, awayTeamScore, attendance, periodScores } = req.body;
    
   
    try{
        const schedule = await Schedule.findByIdAndUpdate({_id:id},{seasonYear, matchDate, homeTeam, awayTeam, venue, status, homeTeamScore, awayTeamScore, attendance, periodScores,updatedBy:userId},{new:true});
        return res.status(200).json(schedule);
    }catch(err){
        console.log(err)
        return res.status(500).json({error: 'Something went wrong'});
    }
}

scheduleControl.scheduleRemove = async(req,res)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
    return res.status(400).json({errors:error.array()});
 }
 const {id} = req.params;
 try{
    const schedule = await Schedule.findByIdAndDelete(id)
    return res.status(200).json(schedule);
 }catch(err){
    return res.status(500).json({error: 'Something went wrong'});
 }

}

export default scheduleControl;