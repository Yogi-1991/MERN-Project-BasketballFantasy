import { Schema,model } from 'mongoose';

const lineupSchema = new Schema({
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true
  },
  teamHome: {
    team: { type: Schema.Types.ObjectId, 
        ref: 'Teams',
         required: true
         },
    starters: [
      {
        player: { type: Schema.Types.ObjectId,
             ref: 'Players',
              required: true 
            },
        position: { type: String, 
            required: true
         }
      }
    ],
    substitutions: [
        {
            player: { type: Schema.Types.ObjectId,
                 ref: 'Players',
                  required: true 
                },
            position: { type: String, 
                required: true
             }
          }
    ]
  },
  teamAway: {
    team: { type: Schema.Types.ObjectId, 
        ref: 'Teams',
         required: true },
    starters: [
      {
        player: { type: Schema.Types.ObjectId,
             ref: 'Players', 
             required: true
             },
        position: { type: String, 
            required: true 
        }
      }
    ],
    substitutions: [
        {
            player: { type: Schema.Types.ObjectId,
                 ref: 'Players', 
                 required: true
                 },
            position: { type: String, 
                required: true 
            }
          }
    ]
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  }
}, {
  timestamps: true
});

const Lineup = model('Lineup',lineupSchema);

export default Lineup;
