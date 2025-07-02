
import Lineup from "../modules/lineups-schema-module.js";
import Teams from "../modules/team-schema-module.js";
import Schedule from "../modules/schedule-schema-module.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

const lineupControl = {};

// lineupControl.create = async(req,res)=>{
//     const error = validationResult(req);
//     if(!error.isEmpty()){
//         return res.status(400).json({errors : error.array()});
//     }
 
//     const { gameId,teamHome,teamAway } = req.body;
//     const userId = req.userId

//     try{
//           //  Get the game and season info
//         const game = await Schedule.findById(gameId);
//         if (!game) return res.status(404).json({ error: "Game not found" });

//         const getSeasonYear = game.seasonYear;

//         //  Validate each home team player starter
// for (const starter of teamHome.starters) {
//     const isPlayerInTeam = await Teams.findOne({_id: teamHome.team,seasons:{$elemMatch:{seasonYear: getSeasonYear,players:starter.player}}
//     });
  
//     if (!isPlayerInTeam) {
//       return res.status(400).json({error: `Player ${starter.player} is not in the home team roster for this season`});
//     }
//   }

//  //  Validate each home team player substitutes
//  for (const subs of teamHome.substitutions) {
//     const isPlayerInTeam = await Teams.findOne({_id: teamHome.team,seasons:{$elemMatch:{seasonYear: getSeasonYear,players:subs.player}}
//     });
  
//     if (!isPlayerInTeam) {
//       return res.status(400).json({error: `Player ${substitutions.player} is not in the home team roster for this season`});
//     }
//   }


// // validate each away team player starter
// for (const starter of teamAway.starters) {
//  const isPlayerInTeam = await Teams.findOne({_id: teamAway.team,seasons:{$elemMatch:{seasonYear:getSeasonYear,players: starter.player}}
//     });
  
//     if (!isPlayerInTeam) {
//       return res.status(400).json({
//         error: `Player ${starter.player} is not in the away team roster for this season`
//       });
//     }
//   }

//   // validate each away team player substitutes
//   for (const subs of teamAway.substitutions) {
//    const isPlayerInTeam = await Teams.findOne({_id: teamAway.team,seasons:{$elemMatch:{seasonYear:getSeasonYear,players: subs.player}}
//       });
    
//       if (!isPlayerInTeam) {
//         return res.status(400).json({
//           error: `Player ${substitutions.player} is not in the away team roster for this season`
//         });
//       }
//     }


//         const lineup = await Lineup.create({gameId,teamHome,teamAway,createdBy:userId});
//         console.log(lineup)
//         return res.status(201).json(lineup);
//     }catch(err){
//         console.log(err);
//         return res.status(500).json({error: 'Something went wrong'});
//     }
    
// }

lineupControl.create = async(req,res)=>{
try {
    const { gameId, teamHome, teamAway } = req.body;
    const userId = req.userId;

    // Check if game exists
    const game = await Schedule.findById(gameId);
    if (!game) return res.status(404).json({ error: 'Match not found' });

    // Prevent duplicate lineups
    const existing = await Lineup.findOne({ gameId });
    if (existing) return res.status(400).json({ error: 'Lineup already exists for this match' });

    // Create lineup
    const lineup = await Lineup.create({
      gameId,
      teamHome,
      teamAway,
      createdBy: userId,
    });

    res.status(201).json({ message: 'Lineup saved', lineup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create lineup' });
  }
}



lineupControl.listLineupByGameId = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors :error.array()});
    }
 const {id} = req.params;
 try{
         console.log("ida",id)

    const lineup = await Lineup.findOne({gameId:id})
    .populate('teamHome.team teamHome.starters.player teamHome.substitutions.player')
    .populate('teamAway.team teamAway.starters.player teamAway.substitutions.player');
    console.log("lineups",lineup)
    if(!lineup){
        return res.status(404).json({error:'No lineup found for this game'});
    }
    return res.status(200).json(lineup);
 }catch(err){
    console.log(err)
    return res.status(500).json({error:'Something went wrong'});
 }
}

lineupControl.lineupUpdate = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }

  try {
    const { id } = req.params;
    const updated = await Lineup.findByIdAndUpdate(id, {...req.body, updatedBy: req.userId}, { new: true });

    if (!updated) return res.status(404).json({ error: 'Lineup not found' });

    res.json({ message: 'Lineup updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update lineup' });
  }



//     const userId = req.userId;
//     const {id} = req.params;  
//     const {gameId,teamHome,teamAway} = req.body;
    
   
//     try{

//         //  Get the game and season info
//         const game = await Schedule.findById(gameId);
//         if (!game) return res.status(404).json({ error: "Game not found" });

//         const getSeasonYear = game.seasonYear;

//         //  Validate each home team player starter
// for (const starter of teamHome.starters) {
//     const isPlayerInTeam = await Teams.findOne({_id: teamHome.team,seasons:{$elemMatch:{seasonYear: getSeasonYear,players:starter.player}}
//     });
  
//     if (!isPlayerInTeam) {
//       return res.status(400).json({error: `Player ${starter.player} is not in the home team roster for this season`});
//     }
//   }

//  //  Validate each home team player substitutes
//  for (const subs of teamHome.substitutions) {
//     const isPlayerInTeam = await Teams.findOne({_id: teamHome.team,seasons:{$elemMatch:{seasonYear: getSeasonYear,players:subs.player}}
//     });
  
//     if (!isPlayerInTeam) {
//       return res.status(400).json({error: `Player ${substitutions.player} is not in the home team roster for this season`});
//     }
//   }


// // validate each away team player starter
// for (const starter of teamAway.starters) {
//  const isPlayerInTeam = await Teams.findOne({_id: teamAway.team,seasons:{$elemMatch:{seasonYear:getSeasonYear,players: starter.player}}
//     });
  
//     if (!isPlayerInTeam) {
//       return res.status(400).json({
//         error: `Player ${starter.player} is not in the away team roster for this season`
//       });
//     }
//   }

//   // validate each away team player substitutes
//   for (const subs of teamAway.substitutions) {
//    const isPlayerInTeam = await Teams.findOne({_id: teamAway.team,seasons:{$elemMatch:{seasonYear:getSeasonYear,players: subs.player}}
//       });
    
//       if (!isPlayerInTeam) {
//         return res.status(400).json({
//           error: `Player ${substitutions.player} is not in the away team roster for this season`
//         });
//       }
//     }
   
//     const lineup = await Lineup.findByIdAndUpdate({_id:id},{gameId,teamHome,teamAway,updatedBy:userId},{new:true});
//         return res.status(200).json(lineup);
//     }catch(err){
//         console.log(err)
//         return res.status(500).json({error: 'Something went wrong'});
//     }
}

lineupControl.lineupRemovebyGameID = async(req,res)=>{
 const error = validationResult(req);
 if(!error.isEmpty()){
    return res.status(400).json({errors:error.array()});
 }
 try {
    const { id } = req.params;
    await Lineup.findByIdAndDelete(id);
    res.json({ message: 'Lineup deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete lineup' });
  }

//  const {gameId} = req.params;

//  //need logic here - if I planned to delete the lineup then lineups related this gameId also needs to be deleted
//  try{
//     const lineup = await Lineup.findOneAndDelete({gameId})
//     return res.status(200).json(lineup);
//  }catch(err){
//     return res.status(500).json({error: 'Something went wrong'});
//  }

}

export default lineupControl;