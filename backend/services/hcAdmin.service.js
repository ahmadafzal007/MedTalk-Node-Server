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
    },

    getHospitals: async () => {
        try {
            // const hospitals = await healthCareCenterAdminModel.aggregate([
            //     {
            //         $group: {
            //             _id: "$hospitalName",
            //             name: { $first: '$hospitalName' }
            //         }
            //     },
            //     {
            //         $project: {
            //             _id: 0,
            //             name: 1
            //         }
            //     }
            // ]);
            const hospitals = await healthCareCenterAdminModel.find({});

            console.log(hospitals);
            return hospitals;
        } catch (error) {
            console.error("Error retrieving hospitals:", error);
            return {
                status: 403,
                error: "Couldn't find hospitals"
            };
        }
    },

    getPendingProfessionals: async (_id) => {
        console.log("I am here")
        try {
            const hospital = await healthCareCenterAdminService.getHospital(_id);
            console.log(hospital);
            if (hospital.error) {
                return {
                    error: true,
                    message: hospital.message
                };
            }

            const pendingProfessionals = await healthCareProfessionalModel.find({
                VerificationStatus: 'pending',
                hospitalName: hospital.hospitalName
            }).populate('user').select('department healthCareCenterId hospitalName VerificationStatus');;

            console.log("pending professional",pendingProfessionals);

            return pendingProfessionals;
        } catch (error) {
            console.error('Error retrieving pending professionals:', error);
            return {
                error: true,
                message: "Internal server error"
            };
        }
    },


    
    getHospital: async (_id) => {
        console.log("gethospital",_id)
        try {
            const hospital = await healthCareCenterAdminModel.findOne({user:_id});
            console.log('hospital ' , hospital);
            if (!hospital) {
                return {
                    error: true,
                    message: "Hospital not found"
                };
            }
            return hospital;
        } catch (error) {
            console.error("Error retrieving hospital:", error);
            return {
                error: true,
                message: "Internal server error"
            };
        }
    }
}

module.exports = healthCareCenterAdminService;