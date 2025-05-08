
const scheduleValidation = {
    seasonYear :{
        in:['body'],
        exists:{
            errorMessage:'seasonYear field is required'
        },
        notEmpty:{
            errorMessage:'seasonYear cannot be empty'
        },
        isMongoId:{
            errorMessage:'Not valid mongodb id'
        }
    },
    matchDate:{
        in:['body'],
        exists:{
            errorMessage:'matchDate field is required'
        },
        notEmpty:{
            errorMessage:'matchDate cannot be empty'
        }
    },
    homeTeam:{
        in:['body'],
        exists:{
            errorMessage:'homeTeam field is required'
        },
        notEmpty:{
            errorMessage:'homeTeam cannot be empty'
        },
        isMongoId:{
            errorMessage:'Not valid mongodb id'
        }
    },
    awayTeam:{
        in:['body'],
        exists:{
            errorMessage:'awayTeam field is required'
        },
        notEmpty:{
            errorMessage:'awayTeam cannot be empty'
        },
        isMongoId:{
            errorMessage:'Not valid mongodb id'
        }
    },
    venue :{
        in:['body'],
        exists:{
            errorMessage:'venue field is required'
        },
        notEmpty:{
            errorMessage:'venue cannot be empty'
        }
    },
    status:{
        in:['body'],
        exists:{
            errorMessage:'status field is required'
        },
        notEmpty:{
            errorMessage:'status cannot be empty'
        }
    },
    homeTeamScore: {
        in:['body'],
        exists:{
            errorMessage:'homeTeamScore field is required'
        },
        notEmpty:{
            errorMessage:'homeTeamScore cannot be empty'
        }
    },
    awayTeamScore: {
        in:['body'],
        exists:{
            errorMessage:'homeTeamScore field is required'
        },
        notEmpty:{
            errorMessage:'homeTeamScore cannot be empty'
        }
    },
    attendance: {
        in:['body'],
        exists:{
            errorMessage:'attendance field is required'
        },
        notEmpty:{
            errorMessage:'attendance cannot be empty'
        } 
    },
    periodScores:{
        in:['body'],
        exists:{
            errorMessage:'periodScores field is required'
        },
        notEmpty:{
            errorMessage:'periodScores cannot be empty'
        } 
    },
    'periodScores.*.periodLabel':{
        in:['body'],
        exists:{
            errorMessage:'periodLabel field is required'
        },
        notEmpty:{
            errorMessage:'periodLabel cannot be empty'
        } 
    },
    'periodScores.*.homeScore':{
        in:['body'],
        exists:{
            errorMessage:'homeScore field is required'
        },
        notEmpty:{
            errorMessage:'homeScore cannot be empty'
        } 
    },
    'periodScores.*.awayScore':{
        in:['body'],
        exists:{
            errorMessage:'awayScore field is required'
        },
        notEmpty:{
            errorMessage:'awayScore cannot be empty'
        } 
    }
    
}

export default scheduleValidation;