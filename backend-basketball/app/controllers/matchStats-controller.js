
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
      


export default matchStatsControl;