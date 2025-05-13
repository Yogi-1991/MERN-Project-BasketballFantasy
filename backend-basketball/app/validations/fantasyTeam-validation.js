
const fantasyTeamValidation = {
    gameId:{
        in:['body'],
        exists:{
            errorMessage: 'gameId field required'
        },
        notEmpty:{
            errorMessage:'gameId cannot be empty'
        },
        isMongoId:{
            errorMessage:'valid mongoDb id required'
        }
    },
    'players.*.playerId':{
        in: ['body'],
        exists:{
            errorMessage: 'Player ID field required'
        },
        notEmpty:{
            errorMessage:'Player ID cannot be empty'
        }
    },
    'players.*.isCaptain':{
        in: ['body'],
        exists:{
            errorMessage: 'isCaptain field required'
        },
        notEmpty:{
            errorMessage:'isCaptain cannot be empty'
        }
    },
    'players.*.isViceCaptain':{
        in: ['body'],
        exists:{
            errorMessage: 'isViceCaptain field required'
        },
        notEmpty:{
            errorMessage:'isViceCaptain cannot be empty'
        }
    }
}

export default fantasyTeamValidation;