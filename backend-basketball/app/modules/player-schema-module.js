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
      enum:['point guard', 'shooting guard', 'small forward', 'power forward',  'center','guard','forward','PG','SG','SF','PF','c','G'],
      default:'center'
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
