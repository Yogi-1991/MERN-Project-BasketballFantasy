import Schedule from "../modules/schedule-schema-module.js";
import { validationResult } from "express-validator";
import Teams from "../modules/team-schema-module.js";


const scheduleControl = {};

scheduleControl.create = async(req,res)=>{
    // const error = validationResult(req);
    // if(!error.isEmpty()){
    //     return res.status(400).json({errors : error.array()});
    // }
 
    // const { seasonYear, matchDate, homeTeam, awayTeam, venue, status, homeTeamScore, awayTeamScore, attendance, periodScores } = req.body;
    // const userId = req.userId

    // try{
    //     const schedule = await Schedule.create({seasonYear, matchDate, homeTeam, awayTeam, venue, status, homeTeamScore, awayTeamScore, attendance, periodScores,createdBy:userId});
    //     console.log(schedule)
    //     return res.status(201).json(schedule);
    // }catch(err){
    //     console.log(err);
    //     return res.status(500).json({error: 'Something went wrong'});
    // }

  try {
    const userId = req.userId;
    const {seasonYear,homeTeam,awayTeam,matchDate,venue} = req.body;
    const newMatch = await Schedule.create({seasonYear,homeTeam,awayTeam,matchDate,venue, createdBy: userId, status: 'pre-game' });

    res.status(201).json(newMatch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create match' });
  }
};

    

scheduleControl.listschedules = async(req,res)=>{
    try{
        const schedule = await Schedule.find()
         .populate('homeTeam', 'teamName')
         .populate('awayTeam', 'teamName')
         .populate('seasonYear', 'name')
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
        .populate('awayTeam', 'teamName logoImage')
        
  
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
    const schedule = await Schedule.findOne({ _id: id })
     .populate('homeTeam' ,'teamName')
     .populate('awayTeam' ,'teamName')

    if(!schedule){
        return res.status(404).json({error:'No schedule found for this league'});
    }
    return res.status(200).json(schedule);
 }catch(err){
    console.log(err)
    return res.status(500).json({error:'Something went wrong'});
 }
}

scheduleControl.updateLive = async (req, res) => {
  const { id } = req.params;
  const { status, attendance, homeTeamScore, awayTeamScore, periodScores } = req.body;
  try {
    const match = await Schedule.findByIdAndUpdate(
      id,
      { status, attendance, homeTeamScore, awayTeamScore, periodScores, updatedBy: req.userId },
      { new: true }
    )
      .populate('homeTeam awayTeam', 'teamName')
      .populate('seasonYear', 'name');
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update live match' });
  }
};

scheduleControl.scheduleUpdate = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }
    const userId = req.userId;
    const {id} = req.params;  
    const { seasonYear, matchDate, homeTeam, awayTeam, venue } = req.body;    
   
    try{
        const schedule = await Schedule.findByIdAndUpdate({_id:id},{seasonYear, matchDate, homeTeam, awayTeam, venue,updatedBy:userId},{new:true});
        return res.status(200).json(schedule);
    }catch(err){
        console.log(err)
        return res.status(500).json({error: 'Something went wrong'});
    }
}

scheduleControl.listPreGame = async (req, res) => {
  try {
    const matches = await Schedule.find()
      .populate('homeTeam awayTeam', 'teamName')
      .sort({ matchDate: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
};

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