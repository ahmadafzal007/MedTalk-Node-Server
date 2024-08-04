
const hcAdmin = require('../services/hcAdmin.service');


const healthCareCenterController = {
    async verify(req,res,next){
        try{
            const {_id,status} = req.body;

            const user = await hcAdmin.verifyUser(_id,status);
            if (center.error){
                const error = {
                    status:401,
                    message:user.message
                }
                return next(error);
            }
            res.status(200).json({
                user
            });
        }catch(error){
            return next(error);
        }
    },

    async getHospitals(req,res,next){
        try{
            const hospitals = await hcAdmin.getHospitals();
            return res.status(200).json({
                "hospitals": hospitals
            });

        }catch(error){
            return next(error);
        }
    },

    async getPendingProfessionals(req, res, next) {
        try {
            console.log(req.user)
            console.log(req.user._id)
            const users = await hcAdmin.getPendingProfessionals(req.user._id);
            if (users.error) {
                return res.status(404).json({ message: "No user found" });
            }
            res.status(200).json({ users });
        } catch (error) {
            return next(error);
        }
    }


}

module.exports = healthCareCenterController;