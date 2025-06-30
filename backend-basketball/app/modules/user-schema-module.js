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
        enum:['teams', 'players', 'schedule', 'matchStats', 'lineups','seasons','leagues']
    }],
    profileImage:{
        type: String
    },
    wallet: {
        balance: { type: Number, default: 5 }, // Free points on registration
        history: [
          {
            amount: Number,
            type: { type: String, enum: ['credit', 'debit'] }, // Transaction type
            description: String, // Why the points were added/deducted
            date: { type: Date, default: Date.now }
          }
        ]
      },
    isActive:{
        type: Boolean,
        default: true
    }
},{timestamps:true});

const User = model('User',userSchema)

export default User;