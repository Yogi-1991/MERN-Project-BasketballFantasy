import { Schema, model } from 'mongoose';

const matchStatSchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true
  },
  playerId: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Teams',
    required: true
  },
  stats: {
    points: { 
          type: Number,
         default: 0 },
    rebounds: {
         type: Number, 
         default: 0
         },
    assists: { 
        type: Number, 
        default: 0 },
    steals: { 
        type: Number,
         default: 0
         },
    blocks: { 
        type: Number,
         default: 0 
        },
    fouls: { 
        type: Number,
         default: 0 
        },
    minutesPlayed: {
         type: Number, 
         default: 0         
    }
  },
  isFinalized: {
       type: Boolean,
      default: false
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const MatchStat = model('MatchStat', matchStatSchema);

export default MatchStat;
