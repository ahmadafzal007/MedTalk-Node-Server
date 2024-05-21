const healthCareCenterAdminModel = require('../models/hcCenter.model');
const healthCareProfessionalModel = require('../models/hcProfessional.model');

const healthCareCenterAdminService = {
    createHealthCareCenterAdmin : async(_id , address,contactNumber) =>{
        let user;
        try{
            user =  new healthCareCenterAdminModel({
                user:_id,
                address,
                contactNumber
            })
            user.save()
        return user;
        }catch(error){
            return {
                status : 500,
                message: "Internal Server Error"
            }
        }
    },

    verifyUser : async(_id,status) =>{
       try{
        const user = await healthCareProfessionalModel.findById(_id);
        if (!user){
            return {
                error:true,
                message:'User not found'
            }
        }
        if (status){
            user.verificationStatus = 'verified';
       }else{
              user.verificationStatus = 'rejected';
       }
         await user.save();
            return user;
         }catch(error){
            return {
                error:true,
                message:error.message
            }
        }
    }
}

module.exports = healthCareCenterAdminService;