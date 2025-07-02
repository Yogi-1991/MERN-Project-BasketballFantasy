import {Schema,model} from "mongoose";

const playerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      enum:['guard','forward','PG','SG','SF','PF','C'],
      default:'c'
    },
    jerseyNumber: {
      type: Number,
    },
    height: {
      type: String,
    },
    weight: {
      type: String,
    },
    nationality: {
      type: String,
    },
    birthdate: {
      type: Date,
    },
    profileImage: {
      type: String,
    },
    credit: { 
      type: Number,
      required: true
     },
     teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Teams',
      required: true,
    },
    seasonYear: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Season'
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Player = model("Player", playerSchema);

export default Player;
