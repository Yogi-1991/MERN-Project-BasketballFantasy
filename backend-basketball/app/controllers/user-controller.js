import User from "../modules/user-schema-module.js";
import { validationResult } from "express-validator";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
const userControl = {};


userControl.register = async(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    }
    try{
        const {name,email,password} = req.body;
        console.log(name,email,password)
        const wallet = {
            balance: 5,
            history: [
              {
                amount: 5,
                type: 'credit',
                description: 'Free points on registration'
              }
            ]
          }
        const user = new User({name,email,password,wallet});
        const salt = await bcryptjs.genSalt();
        const hash = await bcryptjs.hash(password,salt);
        user.password = hash;
        user.role = 'registered';    
        await user.save();
        res.status(201).json(user)
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Somehting went wrong'})
    }    

}

userControl.login = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
       return res.status(400).json({errors : error.array()})
    }

    const {email,password} =req.body;
    try{
        const user = await User.findOne({email:email})
    if(!user){
        res.status(400).json({errors:'Email or Password incorrect'})
    }
    const verifyPassword = await bcryptjs.compare(password,user.password)
        if(!verifyPassword){
            res.status(400).json({error:'Email or Password incorrect'})
        }
    const payload = {userId:user._id,role:user.role,dataEntryTasks:user.dataEntryTasks};
    const token =  jwt.sign(payload,process.env.SECRET_KEY, {expiresIn:'7d'});
    return res.json({token: `bearer ${token}`});      

    }catch(err){
        console.log(err);
        res.status(500).json({error:'Something went wrong'})
    }
    
}

userControl.account = async(req,res)=>{
    const userId = req.userId;
    try{
      
        const user = await User.findById(userId);
        if(user){
            return res.status(200).json(user);
        }
    }catch(err){
        return res.status(500).json({errors : 'Something went wrong'})
    }
}

userControl.update = async(req,res)=>{
   const error = validationResult(req);
   if(!error.isEmpty()){
     return res.status(400).json({errors : error.array()})
   }  
   const {name ,email, password} = req.body;
   try{
    const userId = req.userId;
    const user = await User.findByIdAndUpdate(userId,{name,email,password},{new:true});
    return res.status(200).json(user);
   }catch(err){
        console.log(err);
       return res.status(500).json({errors:'Something went wrong'})
   }
     
}

userControl.updatebyId = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors:error.array()});
    }
    const id = req.params.id;
    try{
        const user = await User.findByIdAndUpdate(id,{isActive:false},{new:true});
        return res.status(200).json(user);
    }catch(err){
        console.log(err);
        return res.status(500).json({errors: 'Somehting went wrong'});
    }
}


userControl.userList = async(req,res)=>{

    try{
      const users = await User.find()
      if(users){
        return res.status(200).json(users)
      }else{
        return res.status(404).json({errors:"No user record found"})
      }

    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})

    }
}

userControl.DataEntryUserList = async(req,res)=>{

    try{
      const users = await User.find({role:'dataentry'})
      if(users){
        return res.status(200).json(users)
      }else{
        return res.status(404).json({errors:"No user record found"})
      }

    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})

    }
}

userControl.DataEntryUserListById = async (req,res)=>{
    const userId = req.params.id
    try{
      const user = await User.findById({_id:userId})
      if(user){
        return res.status(200).json(user)
      }else{
        return res.status(404).json({errors:"No user record found"})
      }

    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'})

    }
}

userControl.createDataEntryAccount = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors: error.array()})
    } 
    const {name,email,password,dataEntryTasks} = req.body;
    console.log(name,email,password)
    try{
        const user = new User({name,email,password});
        const salt = await bcryptjs.genSalt();
        const hash = await bcryptjs.hash(password,salt);
        user.password = hash;
        user.role = 'dataentry';
        user.dataEntryTasks = dataEntryTasks;
        await user.save();
        res.status(201).json(user)
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Somehting went wrong'})
    }    

}

userControl.dataEntryAccountUpdate = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty){
        return res.status(400).json({errors: error.array()});
    }

    const id = req.params.id;
    const {isActive , dataEntryTasks} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    try{
        const user = await User.findByIdAndUpdate(id,{isActive,dataEntryTasks},{new:true});
        return res.status(200).json(user);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Something went wrong'});
    }

}

userControl.walletUpdate = async(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(500).json({errors:error.array()});
    }
    const {id} = req.params;
    const {balance,history} = req.body;
    console.log(balance,history)

    try{
        const user = await User.findByIdAndUpdate(id,{$set:{'wallet.balance':points},$push:{'wallet.history':{ $each:history}}},{new:true})
        return res.status(200).json(user);
    }catch(err){
        console.log(err);
        return res.status(500).json({error: "Something went wrong"});
    }
}


export default userControl