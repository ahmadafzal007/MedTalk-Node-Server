const express = require('express');
const passport = require('passport');
const { registerUser, registerDoctor, registerHospital, login, logout, refreshToken } = require('../Controllers/auth.controllers');
const checkAuthorization = require('../middleware/checkAuthorization');
const errorMiddleware = require('../middleware/error.middleware');

require('../Config/passport')(passport)

const router = express.Router();

// Registration routes for different roles
router.post('/register/user', registerUser);
router.post('/register/doctor', registerDoctor);
router.post('/register/hospital', registerHospital);
router.post('/refresh-token', refreshToken);


// Login route for all users (user, doctor, hospital, admin)
router.post('/login', login);
router.post('/logout', logout);


router.get('/protected-route', passport.authenticate('jwt', { session: false }), checkAuthorization, (req, res) => {
  console.log('Protected route accessed by user:', req.user);
  res.json({ message: 'Access granted' });
});



// Error handling middleware
router.use(errorMiddleware);

module.exports = router;
