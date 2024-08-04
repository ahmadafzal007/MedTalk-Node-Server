const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;


const userModel = require('../models/user.model');

const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || '34ad46e639bfc13ceba961f91d5d654c7598b791eebe36a1b1f2558713198349'
};

module.exports = (passport) => {
    console.log(" hiii ")
    passport.use(
        new JWTStrategy(opts, async (jwt_payload, done) => {
            try {
                console.log("2")
                const user = await userModel.findById(jwt_payload.id);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (err) {
                console.log(err);
                done(err)
            }
    }));
}