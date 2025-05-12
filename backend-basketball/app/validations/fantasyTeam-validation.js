
const fantasyTeamValidation = {
    userId:{},
    gameId:{},
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
    },
    'players.totalCreditsUsed':{
        in: ['body'],
        exists:{
            errorMessage: 'totalCreditsUsed field required'
        },
        notEmpty:{
            errorMessage:'totalCreditsUsed cannot be empty'
        }
    }
}

export default fantasyTeamValidation;