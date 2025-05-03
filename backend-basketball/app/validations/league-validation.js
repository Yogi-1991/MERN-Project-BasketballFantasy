
const leagueValidations = {
    name:{
        in:['body'],
        exists:{
            errorMessage: 'Name field is required'
        },
        notEmpty:{
            errorMessage: 'Name cannot be empty'
        }
    }

}

export default leagueValidations;