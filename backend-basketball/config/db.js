import mongoose from "mongoose";

const configDb = async()=>{
    try{
       await mongoose.connect(process.env.DB_PATH)
       console.log('connected to the database successfully')
    }catch(error)
    {
        console.log(error)

    }
}

export default configDb;