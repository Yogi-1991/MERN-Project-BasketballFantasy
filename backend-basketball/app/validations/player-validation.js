
const playerValidation = {
    firstName:{
        in:['body'],
        exists:{
            errorMessage: 'First name is required'
        },
        notEmpty:{
            errorMessage: 'First name cannot be empty'
        },
        trim:true
    },
    lastName:{
        in:['body'],
        exists:{
            errorMessage: 'First name is required'
        },
        notEmpty:{
            errorMessage: 'First name cannot be empty'
        },
        trim:true

    },
    
}

export default playerValidation;