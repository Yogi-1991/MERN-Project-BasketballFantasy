const dataEntryAuthorization = (permittedTask)=>{
    return((req,res,next)=>{
        if(req.role === 'admin'){
            return next();
        }
        if(req.role === 'dataentry' && req.dataEntryTasks.includes(permittedTask)){
            return next();
        }
        return res.status(403).json({error: 'Not authorized for this task'});
    })
}

export default dataEntryAuthorization;
