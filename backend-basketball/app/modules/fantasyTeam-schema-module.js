import { Schema,model } from "mongoose";

const fantasyTeamSchema = new Schema({
    userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Users', 
            required: true 
            },
    gameId: { 
            type: Schema.Types.ObjectId, 
            ref: 'Schedule', 
            required: true 
            },   
   teamName: {
                type:String
   },
    players: [
                 {
                    playerId: { 
                             type: Schema.Types.ObjectId, 
                             ref: 'Player'
                            },
                     isCaptain: { 
                                type: Boolean, 
                                 default: false 
                                },
                    isViceCaptain: { 
                                 type: Boolean, 
                                 default: false 
                                 }
                 }
    ],
    totalCreditsUsed: Number,
    createdAt: { 
                type: Date, 
                default: Date.now 
                }
  },{timestamps:true});

  const FantasyTeams = model('FantasyTeams',fantasyTeamSchema);
  export default FantasyTeams;