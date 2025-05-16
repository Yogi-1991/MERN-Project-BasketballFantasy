import scoringFormula from './scoringFormula.js';

const calculateFantasyPoints = (stats, isCaptain, isViceCaptain) => {

  const {
    points = 0,
    rebounds = 0,
    assists = 0,   
    steals = 0,
    blocks = 0,
    fouls = 0
  } = stats;

  let fantasyPoints =
    (points * scoringFormula.points) +
    (assists * scoringFormula.assists) +
    (rebounds * scoringFormula.rebounds) +
    (steals * scoringFormula.steals) +
    (blocks * scoringFormula.blocks) +
    (fouls * scoringFormula.fouls);

  if (isCaptain) {
    fantasyPoints = fantasyPoints * 2;
  }
  if (isViceCaptain) {
    fantasyPoints = fantasyPoints * 1.5;
  }

  return Number(fantasyPoints.toFixed(2));
};

export default calculateFantasyPoints;
