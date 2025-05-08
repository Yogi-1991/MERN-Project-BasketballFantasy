
const matchStatsValidation = {
    gameId:{
        in:['body'],
        exists:{
            errorMessage:'GameID field is required'
        },
        notEmpty:{
            errorMessage:'GameId cannot be empty'
        },
        isMongoId:{
            errorMessage:'vaild mongoDB Id should be present'
        }
    },
    playerId:{
        in:['body'],
        exists:{
            errorMessage:'playerId field is required'
        },
        notEmpty:{
            errorMessage:'playerId cannot be empty'
        },
        isMongoId:{
            errorMessage:'vaild mongoDB Id should be present'
        }
    },
    teamId:{
        in:['body'],
        exists:{
            errorMessage:'teamId field is required'
        },
        notEmpty:{
            errorMessage:'teamId cannot be empty'
        },
        isMongoId:{
            errorMessage:'vaild mongoDB Id should be present'
        }
    },
    'stats.points':{
        in:['body'],
        exists:{
            errorMessage:'points field is required'
        },
        notEmpty:{
            errorMessage:'points cannot be empty'
        }
    },
    'stats.rebounds':{
        in:['body'],
        exists:{
            errorMessage:'rebounds field is required'
        },
        notEmpty:{
            errorMessage:'rebounds cannot be empty'
        }
    },
    'stats.assists':{
        in:['body'],
        exists:{
            errorMessage:'assists field is required'
        },
        notEmpty:{
            errorMessage:'assists cannot be empty'
        }
    },
    'stats.steals':{
        in:['body'],
        exists:{
            errorMessage:'steals field is required'
        },
        notEmpty:{
            errorMessage:'steals cannot be empty'
        }
    },
    'stats.blocks':{
        in:['body'],
        exists:{
            errorMessage:'blocks field is required'
        },
        notEmpty:{
            errorMessage:'blocks cannot be empty'
        }
    },
    'stats.fouls':{
        in:['body'],
        exists:{
            errorMessage:'fouls field is required'
        },
        notEmpty:{
            errorMessage:'fouls cannot be empty'
        }
    },
    'stats.minutesPlayed':{
        in:['body'],
        exists:{
            errorMessage:'minutesPlayed field is required'
        },
        notEmpty:{
            errorMessage:'minutesPlayed cannot be empty'
        }
    },
}

export default matchStatsValidation;