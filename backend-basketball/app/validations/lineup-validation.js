
const lineupValidation = {
    gameId:{
        in:['body'],
        exists:{
            errorMessage: 'Game Id field is required'
        },
        notEmpty:{
            errorMessage: 'Game ID cannot be empty'
        }
    },
    'teamHome.team' :{
        in:['body'],
        exists:{
            errorMessage: 'team field is required'
        },
        notEmpty:{
            errorMessage: 'team cannot be empty'
        }
    },
    'teamHome.starters.*.player':{
        in:['body'],
        exists:{
            errorMessage: 'player field is required'
        },
        notEmpty:{
            errorMessage: 'player cannot be empty'
        }
    },
    'teamHome.starters.*.position':{
        in:['body'],
        exists:{
            errorMessage: 'position field is required'
        },
        notEmpty:{
            errorMessage: 'position cannot be empty'
        }
    },
    'teamHome.substitutions.*.player':{
        in:['body'],
        exists:{
            errorMessage: 'player field is required'
        },
        notEmpty:{
            errorMessage: 'player cannot be empty'
        }
    },
    'teamHome.substitutions.*.position':{
        in:['body'],
        exists:{
            errorMessage: 'position field is required'
        },
        notEmpty:{
            errorMessage: 'position cannot be empty'
        }
    },
    'teamAway.team':{
        in:['body'],
        exists:{
            errorMessage: 'team field is required'
        },
        notEmpty:{
            errorMessage: 'team cannot be empty'
        }
    },
    'teamAway.starters.*.player':{
        in:['body'],
        exists:{
            errorMessage: 'player field is required'
        },
        notEmpty:{
            errorMessage: 'player cannot be empty'
        }
    },
    'teamAway.starters.*.position':{
        in:['body'],
        exists:{
            errorMessage: 'position field is required'
        },
        notEmpty:{
            errorMessage: 'position cannot be empty'
        }
    },
    'teamAway.substitutions.*.player':{
        in:['body'],
        exists:{
            errorMessage: 'player field is required'
        },
        notEmpty:{
            errorMessage: 'player cannot be empty'
        }
    },
    'teamAway.substitutions.*.position':{
        in:['body'],
        exists:{
            errorMessage: 'position field is required'
        },
        notEmpty:{
            errorMessage: 'position cannot be empty'
        }
    } 
    
}

export default lineupValidation;