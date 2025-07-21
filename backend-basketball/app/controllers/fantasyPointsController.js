
import MatchStat from '../modules/matchStats-schema-module.js'; 
import FantasyTeam from '../modules/fantasyTeam-schema-module.js';
import FantasyPoints from '../modules/fantasyPoint-schema-module.js';
import calculateFantasyPoints from '../utils/calculatePoints.js';
import Contest from '../modules/contest-schema-module.js';


const processFantasyPoints = async (gameId) => {
  try{
  const stats = await MatchStat.find({ gameId }); 
  if (stats.length===0) {
    console.log("No match stats found for this game.");
    return;
  }

  // Fetch all contests for this game, with participants
  const contests = await Contest.find({ gameId }).populate('participants.fantasyTeamId participants.userId');

  for(const contest of contests){
    for(const participant of contest.participants){
        const team = participant.fantasyTeamId;
        if (!team){
          continue
        } 
        let totalPoints = 0;
        const playerPoints = [];
        for(const player of team.players){
           const {playerId, isCaptain,isViceCaptain} = player
          //  const playerStats = stats.find((s)=>{
          //     return s.playerId.toString === playerId.toString()
          //  })
          const playerStats = stats.find((s) => {
                return s.playerId.toString() === playerId.toString();
              });
           if(playerStats){
            const points = calculateFantasyPoints(playerStats,isCaptain,isViceCaptain);
            playerPoints.push({playerId,points})
            totalPoints=totalPoints+points
           }
        }

                // Upsert fantasy points per user, game, contest, fantasy team
                //using findOneAndUpdate with upsert obj - we can create new record - incase no record found
                await FantasyPoints.findOneAndUpdate(
                  {
                    userId: participant.userId._id,
                    gameId,
                    contestId: contest._id,
                    fantasyTeamId: team._id
                  },
                  {
                    contestId: contest._id,
                    userId: participant.userId._id,
                    gameId,
                    fantasyTeamId: team._id,
                    playerPoints,
                    totalPoints
                  },
                  { upsert: true, new: true }
                );

    }
  }
 console.log("Fantasy points processed for all contests and participants");
  
}catch(err){
  return res.status(500).json({error:'Somethign went wrong'});
}
}

export default  processFantasyPoints