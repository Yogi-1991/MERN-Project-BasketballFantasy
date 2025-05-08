
import Lineup from "../modules/lineups-schema-module.js";
import Teams from "../modules/team-schema-module.js";
import Schedule from "../modules/schedule-schema-module.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

const lineupControl = {};

lineupControl.create = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors : error.array()});
    }
 
    const { gameId,teamHome,teamAway } = req.body;
    const userId = req.userId

    try{
          //  Get the game and season info
        const game = await Schedule.findById(gameId);
        if (!game) return res.status(404).json({ error: "Game not found" });

        const getSeasonYear = game.seasonYear;

        //  Validate each home team player starter
for (const starter of teamHome.starters) {
    const isPlayerInTeam = await Teams.findOne({_id: teamHome.team,seasons:{$elemMatch:{seasonYear: getSeasonYear,players:starter.player}}
    });
  
    if (!isPlayerInTeam) {
      return res.status(400).json({error: `Player ${starter.player} is not in the home team roster for this season`});
    }
  }

 //  Validate each home team player substitutes
 for (const subs of teamHome.substitutions) {
    const isPlayerInTeam = await Teams.findOne({_id: teamHome.team,seasons:{$elemMatch:{seasonYear: getSeasonYear,players:subs.player}}
    });
  
    if (!isPlayerInTeam) {
      return res.status(400).json({error: `Player ${substitutions.player} is not in the home team roster for this season`});
    }
  }


// validate each away team player starter
for (const starter of teamAway.starters) {
 const isPlayerInTeam = await Teams.findOne({_id: teamAway.team,seasons:{$elemMatch:{seasonYear:getSeasonYear,players: starter.player}}
    });
  
    if (!isPlayerInTeam) {
      return res.status(400).json({
        error: `Player ${starter.player} is not in the away team roster for this season`
      });
    }
  }

  // validate each away team player substitutes
  for (const subs of teamAway.substitutions) {
   const isPlayerInTeam = await Teams.findOne({_id: teamAway.team,seasons:{$elemMatch:{seasonYear:getSeasonYear,players: subs.player}}
      });
    
      if (!isPlayerInTeam) {
        return res.status(400).json({
          error: `Player ${substitutions.player} is not in the away team roster for this season`
        });
      }
    }


        const lineup = await Lineup.create({gameId,teamHome,teamAway,updatedBy:userId});
        console.log(lineup)
        return res.status(201).json(lineup);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }
    
}


lineupControl.listLineupById = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors :error.array()});
    }
 const {gameId} = req.query;
 try{
    const lineup = await Lineup.findOne({gameId:gameId})
    if(!lineup){
        return res.status(404).json({error:'No lineup found for this game'});
    }
    return res.status(200).json(lineup);
 }catch(err){
    console.log(err)
    return res.status(500).json({error:'Something went wrong'});
 }
}

// lineupControl.lineupUpdate = async(req,res)=>{
//     const error = validationResult(req);
//     if(!error.isEmpty()){
//         return res.status(400).json({errors:error.array()});
//     }
//     const userId = req.userId;
//     const {id} = req.params;  
//     const { seasonYear, matchDate, homeTeam, awayTeam, venue, status, homeTeamScore, awayTeamScore, attendance, periodScores } = req.body;
    
   
//     try{
//         const lineup = await lineup.findByIdAndUpdate({_id:id},{seasonYear, matchDate, homeTeam, awayTeam, venue, status, homeTeamScore, awayTeamScore, attendance, periodScores,updatedBy:userId},{new:true});
//         return res.status(200).json(lineup);
//     }catch(err){
//         console.log(err)
//         return res.status(500).json({error: 'Something went wrong'});
//     }
// }

// lineupControl.lineupRemove = async(req,res)=>{
//  const error = validationResult(req);
//  if(!error.isEmpty()){
//     return res.status(400).json({errors:error.array()});
//  }
//  const {id} = req.params;
//  try{
//     const lineup = await lineup.findByIdAndDelete(id)
//     return res.status(200).json(lineup);
//  }catch(err){
//     return res.status(500).json({error: 'Something went wrong'});
//  }

// }

export default lineupControl;