const Patient = require('../models/Patient'); // Import Patient model
const Doctor = require('../models/Doctor'); // Import Doctor model

// Controller function to create a new patient
const createPatient = async (req, res) => {
    try {
        // Extract data from the request body
        const { name, cnic, age } = req.body;
        const doctorId = req.user._id; // Extracting doctor's ID from request user

        // Validate data
        if (!name || !cnic || !age) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Check if the CNIC is already in use
        const existingPatient = await Patient.findOne({ cnic });
        if (existingPatient) {
            return res.status(400).json({ message: 'Patient with this CNIC already exists.' });
        }

        // Create a new patient instance
        const newPatient = new Patient({
            doctor: doctorId,
            name,
            cnic,
            age
        });

        // Save the patient to the database
        await newPatient.save();

        // Respond with the newly created patient
        res.status(201).json({ message: 'Patient created successfully.', patient: newPatient });
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

module.exports = { createPatient };
