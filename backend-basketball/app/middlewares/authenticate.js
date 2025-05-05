import jwt from 'jsonwebtoken';

const authenticate = async(req,res,next)=>{
    const token =  req.headers['authorization'];
    if(!token){
        return res.status(400).json({Notice:'Please enter the valid token'})
    }

    try{       
        const tokenExtract = token.split(' ')[1];
        const verifytoken = await jwt.verify(tokenExtract,process.env.SECRET_KEY)
        if(verifytoken){
            req.userId = verifytoken.userId;   
            req.role = verifytoken.role;
            req.dataEntryTasks = verifytoken.dataEntryTasks || [];
            next();
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({errors : error})
    }
    
}     

export default authenticate;    