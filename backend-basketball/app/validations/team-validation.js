

const teamValidation = {
    teamName:{
        in:['body'],
        exists:{
             errorMessage: "Team name field is required"
        },
        notEmpty:{
            errorMessage: " Team name cannot be empty"
        }
    },
    homeCity:{
        in:['body'],
        exists:{
             errorMessage: "Home city  field is required"
        },
        notEmpty:{
            errorMessage: " Home city cannot be empty"
        }
    },
    seasons:{
        in:['body'],
        exists:{
             errorMessage: "Seasons must be an array"
        },
        notEmpty:{
            errorMessage: " At least one season must be provided"
        }
    },
    'seasons.*.seasonYear':{ //validating the array of object
        in:['body'],
        exists:{
             errorMessage: "Season year is required"
        },
        notEmpty:{
            errorMessage: " Season year cannot be empty"
        }
    },
    'seasons.*players.*':{
        isMongoId: {
            errorMessage: "Enter valid mongoDB id"
        }
    },
    leagueId:{
        isMongoId: {
            errorMessage: "Enter valid mongoDB id"
        }
    }
    
}

export default teamValidation;