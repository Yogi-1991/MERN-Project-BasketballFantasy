
const seasonValidations = {
    name:{
        in:['body'],
        exists:{
            errorMessage: 'Name field is required'
        },
        notEmpty:{
            errorMessage: 'Name cannot be empty'
        }
    },
    startDate:{
        in:['body'],
        exists:{
            errorMessage: 'Start date field is required'
        },
        notEmpty:{
            errorMessage: 'Start date cannot be empty'
        }
    },
    endDate:{
        in:['body'],
        exists:{
            errorMessage: 'End date field is required'
        },
        notEmpty:{
            errorMessage: 'End date cannot be empty'
        }
    },
    leagueId:{
        in:['body'],
        exists:{
            errorMessage: 'league  field is required'
        },
        notEmpty:{
            errorMessage: 'league cannot be empty'
        }
    }

}

export default seasonValidations;