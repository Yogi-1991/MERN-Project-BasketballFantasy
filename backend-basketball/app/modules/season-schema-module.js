
import { Schema,model } from "mongoose";

const seasonSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    leagueId:{
        type: Schema.Types.ObjectId,
        ref:'League',
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true});

const Season = model('Season',seasonSchema);

export default Season;