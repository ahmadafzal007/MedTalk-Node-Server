const express = require('express');
const passport = require('passport');
const { viewUnauthorizedDoctors, viewAuthorizedDoctors, authorizeTheDoctor,viewHospitalProfile, unauthorizeTheDoctor, deleteDoctor, viewAuthorizedHospitals } = require('../Controllers/hospital.controller');
const errorMiddleware = require('../middleware/error.middleware');

const router = express.Router();

// Route to view unauthorized doctors for the authenticated hospital
router.get('/unauthorizedDoctors', passport.authenticate('jwt', { session: false }), viewUnauthorizedDoctors);


// Route to view authorized doctors
router.get('/authorizedDoctors', passport.authenticate('jwt', { session: false }) ,viewAuthorizedDoctors);


// Route to authorize a doctor
router.patch('/authorizeDoctor', passport.authenticate('jwt', { session: false }), authorizeTheDoctor); // Use PATCH for updating status


// Route to unauthorize a doctor
router.patch('/unauthorizeDoctor',passport.authenticate('jwt', { session: false }) ,unauthorizeTheDoctor); // Use PATCH for updating status


// Route to delete an unauthorized doctor
router.delete('/deleteDoctor', passport.authenticate('jwt', { session: false }) , deleteDoctor); // Use DELETE for removing a doctor

// Route to view authorized hospitals
router.get('/viewAuthorizedHospitals',  passport.authenticate('jwt', { session: false }) ,viewAuthorizedHospitals); // New route


// Route to view hospital profile
router.get('/profile', passport.authenticate('jwt', { session: false }), viewHospitalProfile);


// Error handling middleware
router.use(errorMiddleware);

module.exports = router;
