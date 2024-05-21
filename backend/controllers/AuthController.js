const userAuth = require('../Services/auth.service')

const AuthController = {

    async login(req, res,next) {
        console.log("POST /login called ")
        const {email,password,role} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: 'Email and password are required'});
        }
        try{
            const user = await userAuth.login(email,password,role);
            if (user.error) {
                const error = {
                    status: 401,
                    message: user.message
                }
                return next(error);
            }
            res.status(200).json({
                
                user : user.user,
                token : user.token
            });


        }catch(error){
            return next(error);
        }
    },

    async signup(req, res,next) {

        try{
            const {role} = req.body;

            console.log("POST /signup called ")

            const user = await userAuth.signup(role,req.body);
            if (user.error) {
                const error = {
                    status: 401,
                    message: user.message
                }
                return next(error);
            }
            res.status(200).json({
                user : user.user,
                token : user.token
            });
        }catch(error){
           return next(error);
        }
    }
}


module.exports = AuthController;