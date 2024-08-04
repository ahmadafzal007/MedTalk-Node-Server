const healthCareCenterAdminModel = require('../models/hcCenter.model');


const AdminServices = {
    verifyAdmin: async (_id,verify) => {
        try {
            const admin = await healthCareCenterAdminModel.findById(_id);
            if (!admin) {
                return {
                    error: true,
                    message: 'Admin not found'
                }
            }
            if (verify) {
                admin.verificationStatus = 'verified';
            }else{
                admin.verificationStatus = 'rejected';

            }
            await admin.save();

            return {
                error: false,
                admin
            }
        } catch (error) {
            return {
                error: true,
                message: error.message
            }
        }
    }


}

module.exports = AdminServices;