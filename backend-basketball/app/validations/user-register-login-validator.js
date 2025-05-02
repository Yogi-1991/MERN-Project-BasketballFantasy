import User from "../modules/user-schema-module.js"
const userRegisterValidation = {
    name:{
        in: ['body'],
        exists: {
            errorMessage : 'Name field is required'
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty'
        }
    },
    email:{
        in: ['body'],
        exists: {
            errorMessage: 'Email filed is required'
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
        isEmail: {
            errorMessage: 'Email format not valid'
        },
        trim : true,
        normalizeEmail: true,
        custom:{
            options: async function(value) {
                try{
                    const user = await User.findOne({email:value});
                    if(user){
                        throw new Error(`${value} already registered with us`);
                    }
                }catch(error){
                    throw new Error(error);
                }
                return true
            }
        }
    },
    password:{
        in: ['body'],
        exists: {
            errorMessage: 'Password field is required'
        },
        notEmpty:{
            errorMessage: 'Password cannot be empty'
        },
        trim: true,
        isStrongPassword:{
            options:{
                minLowercase: 1,
                minUppercase:1,
                minNumbers:1,
                minSymbols:1,
                minLength: 8,
                maxLength: 20  
            },
            errorMessage: 'The password must contain at least one lowercase letter, one uppercase letter, one symbol, and one number. It should be between 8 and 12 characters in length.'
        }
    },
}

const userLoginValidation = {
    email:{
        in: ['body'],
        exists: {
            errorMessage: 'Email filed is required'
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
        normalizeEmail : true,
        trim:true
    },
    password:{
        in:['body'],
        exists:{
            errorMessage: 'Password field is required'
        },
        notEmpty:{
            errorMessage:'Password cannot be empty'
        },
        trim:true,
        isStrongPassword:{
            options:{
                minUppercase:1,
                minLowercase:1,
                minNumbers:1,
                minSymbols:1,
                minLength:8,
                maxLength:20
            },
            errorMessage: 'The password must contain at least one lowercase letter, one uppercase letter, one symbol, and one number. It should be between 8 and 12 characters in length.'
        }
    }
}

export {userRegisterValidation, userLoginValidation}