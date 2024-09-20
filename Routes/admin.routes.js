const express = require('express');
const router = express.Router();
const passport = require('passport');
const { viewUnauthorizedHospitals, viewAuthorizedHospitals, authorizeHospital, unauthorizeHospital, deleteUnauthorizedHospital } = require('../Controllers/admin.controller');
const errorMiddleware = require('../middleware/error.middleware');

// Route to view unauthorized hospitals, only accessible by admins
router.get('/unauthorizedHospitals', passport.authenticate('jwt', { session: false }),  viewUnauthorizedHospitals);

// View Authorized Hospitals
router.get('/authorizedHospitals', passport.authenticate('jwt', { session: false }), viewAuthorizedHospitals);

// Authorize Hospital (by hospitalId)
router.patch('/authorizeTheHospital',passport.authenticate('jwt', { session: false }), authorizeHospital);


// Route to unauthorize a hospital
router.patch('/unauthorizeTheHospital',passport.authenticate('jwt', { session: false }), unauthorizeHospital);


//Route to delete the unauthorized hospital
router.delete('/deleteUnauthorizedHospital' ,passport.authenticate('jwt', { session: false }) , deleteUnauthorizedHospital);


// Error handling middleware
router.use(errorMiddleware);

module.exports = router;
