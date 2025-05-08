
import {Schema,model} from 'mongoose';

const scheduleSchema = new Schema({
    seasonYear: {
    type: Schema.Types.ObjectId,
    ref: 'Season',  // Reference to the Season model
    required: true,
  },
  matchDate: {
    type: Date,
    required: true,
  },
  homeTeam: {
    type:Schema.Types.ObjectId,
    ref: 'Team',  // Reference to the Team model
    required: true,
  },
  awayTeam: {
    type: Schema.Types.ObjectId,
    ref: 'Team',  // Reference to the Team model
    required: true,
  },
  venue: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pre-game', 'in-progress', 'canceled', 'final', 'postponed'],
    default: 'pre-game',  
  },
  homeTeamScore: {
    type: Number,
    default: 0,
  },
  awayTeamScore: {
    type: Number,
    default: 0,
  },
  attendance: {
    type: Number,
    default: 0,
  },
  periodScores: [{
    periodLabel: {
      type: String,
      required: true, // e.g., 'Q1', 'Q2', 'OT1'
    },
    homeScore: {
      type: Number,
      default: 0,
    },
    awayScore: {
      type: Number,
      default: 0,
    },
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model (admin or data-entry)
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
  },
}, { timestamps: true });  

const Schedule = model('Schedule', scheduleSchema);

export default Schedule;
