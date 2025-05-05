
const playerValidation = {
    firstName:{
        in:['body'],
        exists:{
            errorMessage: 'First name is required'
        },
        notEmpty:{
            errorMessage: 'First name cannot be empty'
        }
    },
    lastName:{
        in:['body'],
        exists:{
            errorMessage: 'First name is required'
        },
        notEmpty:{
            errorMessage: 'First name cannot be empty'
        }
    },
    
}

export default playerValidation;