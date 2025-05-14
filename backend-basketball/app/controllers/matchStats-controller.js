
import { validationResult } from "express-validator";
import MatchStat from "../modules/matchStats-schema-module.js";

const matchStatsControl = {};

matchStatsControl.create = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()});
    }

    const { playerStats } = req.body;
    const updatedBy = req.userId;
    
    try{
               
          const data = playerStats.map((p)=>{
             return({
                gameId:p.gameId,
                teamId: p.teamId,
            playerId: p.playerId,
            stats: p.stats,
            updatedBy})
             
          })
      
         const matchStats = await MatchStat.insertMany(data); // try to load the data in one go
          res.status(201).json(matchStats);        

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