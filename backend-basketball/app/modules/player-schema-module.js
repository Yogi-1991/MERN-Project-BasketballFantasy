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
    profileImageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Player = model("Player", playerSchema);

export default Player;
