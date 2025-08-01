import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const teamSchema = new Schema({
  teamName: {
    type: String,
    required: true,
    trim:true
  },
  logoImage: {
    type: String,
  },
  homeCity: {
    type: String,
    required: true,
    trim:true
  },
  seasons: [{
    seasonYear: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Season'
    },
    coachName: {
      type: String,
      required: true,
      trim:true
    },
    players: [{
      type: Schema.Types.ObjectId,
      ref: 'Player'
    }]
  }],
  leagueId: {
    type: Schema.Types.ObjectId,
    ref: 'League',  
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
