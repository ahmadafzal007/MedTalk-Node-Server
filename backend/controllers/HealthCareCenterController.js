
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
    }
}