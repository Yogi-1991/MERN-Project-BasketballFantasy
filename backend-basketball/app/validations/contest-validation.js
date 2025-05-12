
const contestValidation = {
    name:{
        in:['body'],
        exists:{
            errorMessage:'name field is required'
        },
        notEmpty:{
            errorMessage:'name caanot be empty'
        }
    },
    gameId:{
        in:['body'],
        exists:{
            errorMessage:'gameId field is required'
        },
        notEmpty:{
            errorMessage:'gameId caanot be empty'
        }
    },
    entryFee:{
        in:['body'],
        exists:{
            errorMessage:'entryFee field is required'
        },
        notEmpty:{
            errorMessage:'entryFee caanot be empty'
        }
    },
    prizePool:{
        in:['body'],
        exists:{
            errorMessage:'prizePool field is required'
        },
        notEmpty:{
            errorMessage:'prizePool caanot be empty'
        }
    },
    maxPlayers:{
        in:['body'],
        exists:{
            errorMessage:'maxPlayers field is required'
        },
        notEmpty:{
            errorMessage:'maxPlayers caanot be empty'
        }
    },
   ' participants.*.userId':{
    in:['body'],
        exists:{
            errorMessage:'userId field is required'
        },
        notEmpty:{
            errorMessage:'userId caanot be empty'
        }
   },
   'participants.*.fantasyTeamId':{
    in:['body'],
        exists:{
            errorMessage:'fantasyTeamId field is required'
        },
        notEmpty:{
            errorMessage:'fantasyTeamId caanot be empty'
        }
   },
   type:{
    in:['body'],
        exists:{
            errorMessage:'type field is required'
        },
        notEmpty:{
            errorMessage:'type caanot be empty'
        }
   },
   status:{
    in:['body'],
    exists:{
        errorMessage:'status field is required'
    },
    notEmpty:{
        errorMessage:'status caanot be empty'
    }
   }
}

export default contestValidation;