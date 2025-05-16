
import Contest from '../modules/contest-schema-module.js'
import FantasyTeams from '../modules/fantasyTeam-schema-module.js';
import User from '../modules/user-schema-module.js';
import FantasyPoints from '../modules/fantasyPoint-schema-module.js';

const distributePrizes = async (contestId) => {
  try {
    

    const contest = await Contest.findById(contestId).populate('participants.userId');
        if (!contest){
            return console.error("Contest not found");
          } 
        if (!contest || contest.prizesDistributed) {
             return  console.log("Prizes already distributed");
        }

    const participantPoints = [];

for (const p of contest.participants) {
    const pointsDoc = await FantasyPoints.findOne({fantasyTeamId: p.fantasyTeamId,contestId: contest._id});
  
    if (!pointsDoc || typeof pointsDoc.totalPoints !== "number"){
        continue
    } ;
  
    participantPoints.push({
      userId: p.userId.toString(),
      fantasyPoints: pointsDoc.totalPoints,
    });
  }

    // Sort by points descending
    participantPoints.sort((a, b)=>{
        return b.fantasyPoints - a.fantasyPoints;
    }) 


    const pool = contest.prizePool;
    const winners = [];

    if (participantPoints.length === 1) {
        winners.push({ userId: participantPoints[0].userId, amount: pool }); // 100%
      } else if (participantPoints.length === 2) {
        winners.push({ userId: participantPoints[0].userId, amount: pool * 0.6 }); // 60% 
        winners.push({ userId: participantPoints[1].userId, amount: pool * 0.4 }); // 40%
      } else if (participantPoints.length >= 3) {
        winners.push({ userId: participantPoints[0].userId, amount: pool * 0.5 });
        winners.push({ userId: participantPoints[1].userId, amount: pool * 0.3 });
        winners.push({ userId: participantPoints[2].userId, amount: pool * 0.2 });
      }

    for (const winner of winners) {
      const user = await User.findById(winner.userId);
      if (!user) {
        continue;
      }
      user.wallet.balance += winner.amount;
      user.wallet.history.push({
        amount: winner.amount,
        type: "credit",
        description: `Prize for contest ${contest.name}`,
      });
      await user.save();

contest.prizesDistributed = true;
await contest.save();
}

console.log(`Prizes distributed for contest: ${contest.name}`);
} catch (err) {
console.error("Error distributing prizes:", err);
}
};

export default distributePrizes;