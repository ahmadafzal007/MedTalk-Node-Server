const healthCareProfessionalModel = require('../models/hcProfessional.model');
const healthCareCenterModel = require('../models/hcCenter.model');

const healthCareProfessional = {
    createHealthCareProfessional : async(_id , hcCenterId,department , hospitalName) =>{
        let user;
        let center;
        try{
            user =  new healthCareProfessionalModel({
                user:_id,
                department: department,
                healthCareCenterId:hcCenterId,
                hospitalName
            })

            user.save()
        center = await healthCareCenterModel.findOne({hospitalName});
        center.HealthCareProfessionals.push(user._id);
        center.save();
        
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