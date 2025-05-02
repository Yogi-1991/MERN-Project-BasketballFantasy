import { Schema,model } from "mongoose";

const userSchema = new Schema({
    name:{
        type : String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    role:{
        type:String,
    },
    dataEntryTasks: [{
        type: String,
        enum:['teams', 'schedule', 'matchStats', 'player']
    }],
    profileImage:{
        type: String
    },
    isActive:{
        type: Boolean,
        default: true
    }
},{timestamps:true});

const User = model('User',userSchema)

export default User;