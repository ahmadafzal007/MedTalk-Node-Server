const healthCareProfessionalModel = require('../models/hcProfessional.model');

const healthCareProfessional = {
    createHealthCareProfessional : async(_id , hcCenterId,department) =>{
        let user;
        try{
            user =  new healthCareProfessionalModel({
                user:_id,
                department: department,
                healthCareCenterId:hcCenterId
            })

            user.save()

        return user;

        }catch(err){
            return {
                status : 500,
                message: "Internal Server Error"
            }
        }
    }
}

module.exports = healthCareProfessional