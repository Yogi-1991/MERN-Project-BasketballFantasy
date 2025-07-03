
import { validationResult } from "express-validator";
import MatchStat from "../modules/matchStats-schema-module.js";
import Schedule from "../modules/schedule-schema-module.js";
import processFantasyPoints from '../controllers/fantasyPointsController.js';
import Contest from "../modules/contest-schema-module.js";
import distributePrizes from '../controllers/distributePrizes.js'

const matchStatsControl = {};

matchStatsControl.create = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }

    const { playerStats } = req.body;
    const updatedBy = req.userId;
    const gameIdStatsCheck = playerStats[0].gameId;

    if (!gameIdStatsCheck) {
      return res.status(400).json({ error: "Missing gameId in playerStats." });
    }

    try{               
          const data = playerStats.map((p)=>{
             return({
                gameId:p.gameId,
                teamId: p.teamId,
            playerId: p.playerId,
            stats: p.stats,
            updatedBy})
             
          })
          //Removing old stats before inserting new ones to prvent duplicates
          await MatchStat.deleteMany({ gameId: gameIdStatsCheck });
      
         const matchStats = await MatchStat.insertMany(data); // try to load the data in one go 
          await Schedule.findByIdAndUpdate(gameIdStatsCheck,{isStatsCompleted:true});
          await processFantasyPoints(gameIdStatsCheck);
          await Contest.updateMany({gameId:gameIdStatsCheck},{status:'completed'},{new:true});//used updateMany - there may private and public contest for the same game ...
          
          const contests = await Contest.find({ gameId: gameIdStatsCheck });
            for (const contest of contests) {
            await distributePrizes(contest._id); // This will handle prize crediting
                }
          
          return res.status(201).json(matchStats);        

    }catch(err){
        console.log(err);
        return res.status(500).json({error:"Something went wrong"});
    }
}

matchStatsControl.matchStatsUpdate = async(req,res)=>{
        const { gameId, playerId } = req.params;
        const { stats } = req.body;
        const updatedBy = req.userId;
      
        try {
          const updated = await MatchStat.findOneAndUpdate({gameId, playerId },{ $set:{ stats, updatedBy}},{new: true });
          if (!updated) {
            return res.status(404).json({ message: 'Match stat not found' });
          }
          return res.status(200).json(updated);
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: 'Something went wrong' });
        }
      }

  matchStatsControl.getStatsByGameId = async (req, res) => {
            try {
               
                const { id } = req.params;
                const stats = await MatchStat.find({ gameId: id })
                .populate('playerId', 'firstName lastName')
                .populate('teamId', 'teamName');

                 res.json(stats);
            } catch (err) {
              res.status(500).json({ error: 'Failed to fetch stats' });
            }
    };

  matchStatsControl.insertUpdateMatchStats  = async (req, res) => {
  try {
    const userId = req.userId;
    const statsArray = req.body.stats;

    if (!Array.isArray(statsArray)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    for (const stat of statsArray) {
      const { gameId, playerId, teamId, stats } = stat;

      await MatchStat.findOneAndUpdate(
        { gameId, playerId },
        {
          $set: {
            teamId,
            stats,
            updatedBy: userId
          }
        },
        { upsert: true, new: true }
      );
    }

    return res.json({ message: 'Match stats saved successfully' });
  } catch (err) {
    console.error('Failed to upsert match stats:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
      
matchStatsControl.editStats = async (req, res) => {
  const { gameId, playerId, teamId, stats } = req.body;
  try{
  const newStat = await MatchStat.create({ gameId, playerId, teamId, stats, updatedBy: req.user._id });
  return res.json(newStat);
  }catch(err){
    console.log(err);
    return res.status(500).json({error: 'Something went wrong'});
  }
  
};

matchStatsControl.UpdateStats = async (req, res) => {
   try{
    const updated = await MatchStat.findOneAndUpdate(
    { gameId: req.params.gameId, playerId: req.params.playerId },
    { stats: req.body.stats, updatedBy: req.userId },
    { new: true }
  );
  return res.status(200).json(updated);
   }catch(err){
    console.log(err);
    return res.status(500).json({error: 'Something went wrong'})
   }
  
  
}

matchStatsControl.deleteStats = async (req, res) => {
  try{
     await MatchStat.deleteOne({ gameId: req.params.gameId, playerId: req.params.playerId });
      res.status(200).json({ message: "Stats deleted successfully" });
  }catch(err){
    console.log(err)
    return res.status(500).json({error:'Something went wrong'})
  }
 
};

export default matchStatsControl;