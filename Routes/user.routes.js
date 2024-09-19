const express = require('express');
const passport = require('passport');
const { viewProfile, updateUserProfile, upgradeToDoctor } = require('../Controllers/user.controllers');
const checkAuthorization = require('../middleware/checkAuthorization');

const router = express.Router();

// View profile route (protected)
router.get('/profile', passport.authenticate('jwt', { session: false }), checkAuthorization, viewProfile);
router.put('/profile/update', passport.authenticate('jwt', { session: false }), checkAuthorization, updateUserProfile);
router.post('/profile/upgrade', passport.authenticate('jwt', { session: false }), checkAuthorization, upgradeToDoctor);



module.exports = router;
