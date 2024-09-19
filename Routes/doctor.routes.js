const express = require('express');
const passport = require('passport');
const { createPatient } = require('../Controllers/doctor.controllers');
const errorMiddleware = require('../middleware/error.middleware');

const router = express.Router();

// Route to create a new patient
router.post('/createPatient', passport.authenticate('jwt', { session: false }), createPatient);

// Error handling middleware
router.use(errorMiddleware);

module.exports = router;
