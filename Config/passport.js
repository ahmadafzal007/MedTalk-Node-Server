const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/User'); // Ensure correct path
const RefreshToken = require('../models/RefreshToken');

// Configure options for JWT Strategy
const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'vskhskljfjalj84390qnf0', // Ensure this matches the secret used in token generation
};

module.exports = (passport) => {
    console.log("Initializing Passport JWT Strategy");

    passport.use(new JWTStrategy(opts, async (jwt_payload, done) => {
        try {
            console.log('JWT Payload:', jwt_payload); // Log payload for debugging
    
            const user = await User.findById(jwt_payload.id);
            if (!user) {
                console.log(`User not found: ${jwt_payload.id}`);
                return done(null, false, { message: 'User not found' });
            }
    
            const refreshToken = await RefreshToken.findOne({ user: jwt_payload.id });
            if (!refreshToken) {
                console.log(`Refresh token not found for user ID: ${jwt_payload.id}`);
                return done(null, false, { message: 'Refresh token not found' });
            }
    
            console.log('User and refresh token validated successfully');
            return done(null, user);
    
        } catch (err) {
            console.error('Error in Passport JWT Strategy:', err);
            return done(err, false);
        }
    }));
    
};


