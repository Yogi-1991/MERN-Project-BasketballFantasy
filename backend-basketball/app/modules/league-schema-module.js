import { Schema,model } from "mongoose";

const leagueSchema = new Schema({
    name:{
        type:String,
        required: true,
        unique:true
    },
    country:{
        type:String
    },
    logo:{
        type: String
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{timestamps:true})

const League = model('League',leagueSchema);

export default League;