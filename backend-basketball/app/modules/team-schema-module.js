import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const teamSchema = new Schema({
  teamName: {
    type: String,
    required: true,
  },
  logoImage: {
    type: String,
  },
  homeCity: {
    type: String,
    required: true,
  },
  seasons: [{
    seasonYear: {
      type: String, // or Schema.Types.ObjectId if referencing a separate Season collection
      required: true
    },
    coachName: {
      type: String,
      required: true
    },
    players: [{
      type: Schema.Types.ObjectId,
      ref: 'Player'
    }]
  }],
  leagueId: {
    type: Schema.Types.ObjectId,
    ref: 'League',  // Reference to the League model
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Teams = model('Teams', teamSchema);
export default Teams;
