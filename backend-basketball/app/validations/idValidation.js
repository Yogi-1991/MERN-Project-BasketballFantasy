
const idValidation = {
    id:{
        in : ['params'],
        isMongoId:{
            errorMessage: "Valid mongodb id should be present"
        }
    }
}

export default idValidation;