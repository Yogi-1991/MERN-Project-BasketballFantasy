
import { Schema,model } from "mongoose";

const seasonSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    stateDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    league:{
        type: Schema.Types.ObjectId,
        ref:'League',
        required:true
    },
    isActive:{
        type:Boolean,
        required: true
    }
},{timestamps:true});

const Season = model('Season',seasonSchema);

export default Season;