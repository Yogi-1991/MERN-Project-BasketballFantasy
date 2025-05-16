import { Schema, model } from "mongoose";

const fantasyPointsSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId,
     ref: "Users" 
    },
  gameId: { 
    type: Schema.Types.ObjectId,
     ref: "Schedule" 
    },
  fantasyTeamId: {
     type: Schema.Types.ObjectId,
      ref: "FantasyTeams" 
    },
  playerPoints: [{
    playerId: { type: Schema.Types.ObjectId, ref: "Players" },
    points: Number
  }],
  totalPoints: Number
},{timestamps:true});

const FantasyPoints = model("FantasyPoints", fantasyPointsSchema);
export default FantasyPoints;
