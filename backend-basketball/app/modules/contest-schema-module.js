
import { Schema,model } from "mongoose";

const contestSchema = new Schema({
    name: String,
    gameId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Schedule' 
    },
    entryFee: Number,
    prizePool: Number,
    maxPlayers: Number,
    participants: [
      {
        userId: { 
            type: Schema.Types.ObjectId, 
                ref: 'Users' 
            },
        fantasyTeamId: { 
            type: Schema.Types.ObjectId, 
            ref: 'FantasyTeams' 
        }
      }
    ],
    type: { 
        type: String, 
        enum: ['public', 'private'], 
        default: 'public' 
    },
    status: { 
        type: String,
         enum: ['upcoming', 'running', 'completed'], 
         default: 'upcoming' }
  });
  
  const Contest = model('Contest',contestSchema);
  export default Contest;