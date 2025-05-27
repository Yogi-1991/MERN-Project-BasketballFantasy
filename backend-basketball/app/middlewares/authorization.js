
const authorization = (permittedUsers)=>{

    return((req,res,next)=>{
        if(permittedUsers.includes(req.role))
        {
            next()
        }else{
            res.status(403).json({error: 'Not Authorized'})
        }
    })
}

export default authorization;