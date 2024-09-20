const express = require('express');
const passport = require('passport');
const { createPatient, viewPatient, viewPatientChat, getAllPatients, viewDoctorProfile } = require('../Controllers/doctor.controllers');
const errorMiddleware = require('../middleware/error.middleware');

const router = express.Router();

// Route to create a new patient
router.post('/createPatient', passport.authenticate('jwt', { session: false }), createPatient);


// Route to view patient details
router.get('/patients/:patientId', passport.authenticate('jwt', { session: false }), viewPatient);


// Route to get all patients for the authenticated doctor
router.get('/allpatients', passport.authenticate('jwt', { session: false }), getAllPatients);


// Route to view patient chat history
router.get('/patientsChat/:id', passport.authenticate('jwt', { session: false }), viewPatientChat);


// Route to view doctor profile
router.get('/profile', passport.authenticate('jwt', { session: false }), viewDoctorProfile);



// Error handling middleware
router.use(errorMiddleware);

module.exports = router;
