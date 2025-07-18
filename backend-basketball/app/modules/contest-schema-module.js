
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
                ref: 'User' 
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
    },
    invitationCode: String, // for the private contest
    createdBy: {
             type: Schema.Types.ObjectId,
             ref: "User",
             required: true,
  },
    status: { 
        type: String,
         enum: ['upcoming', 'running', 'completed'], 
         default: 'upcoming' },
    prizesDistributed: {
            type: Boolean,
            default: false
    }
  });
  
  const Contest = model('Contest',contestSchema);

  export default Contest;