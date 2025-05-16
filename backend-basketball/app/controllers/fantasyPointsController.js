
import MatchStat from '../modules/matchStats-schema-module.js'; 
import FantasyTeam from '../modules/fantasyTeam-schema-module.js';
import FantasyPoints from '../modules/fantasyPoint-schema-module.js';
import calculateFantasyPoints from '../utils/calculatePoints.js';

const processFantasyPoints = async (gameId) => {
  const stats = await MatchStat.find({ gameId }); 
  const teams = await FantasyTeam.find({ gameId });

  for (const team of teams) {
    let totalPoints = 0;
    const playerPoints = [];

    for (const player of team.players) {
      const { playerId, isCaptain, isViceCaptain } = player;
      const playerStat = stats.find(s => s.playerId.toString() === playerId.toString());

      if (playerStat) {
        const points = calculateFantasyPoints(playerStat, isCaptain, isViceCaptain);
        playerPoints.push({ playerId, points });
        totalPoints = totalPoints+ points;
      }
    }

    await FantasyPoints.create({
      userId: team.userId,
      gameId,
      fantasyTeamId: team._id,
      playerPoints,
      totalPoints
    });
  }
};

export default  processFantasyPoints