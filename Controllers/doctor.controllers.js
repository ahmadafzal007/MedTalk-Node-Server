const Patient = require('../models/Patient'); // Import Patient model
const Doctor = require('../models/Doctor');   // Import Doctor model
const Chat = require('../models/Chat');       // Import Chat model
const mongoose = require('mongoose');

// Controller function to create a new patient
exports.createPatient = async (req, res) => {
    try {
        // Extract data from the request body
        const { name, cnic, age } = req.body;
        const doctorId = req.user._id; // Extracting doctor's ID from request user

        // Validate data
        if (!name || !cnic || !age) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // Check if the CNIC is already in use by the same doctor
        const existingPatient = await Patient.findOne({ cnic, doctor: doctorId });

        if (existingPatient) {
            return res.status(400).json({ message: 'Patient with this CNIC already exists for this doctor.' });
        }

        // Create an empty chat window for the patient
        const newChatWindow = new Chat({
            users: [doctorId], // Add the doctor as the user in the chat window
            patient: null,     // Patient will be added after creating it
            messages: []       // Start with an empty messages array
        });

        // Save the chat window to the database
        await newChatWindow.save();

        // Create a new patient instance
        const newPatient = new Patient({
            doctor: doctorId,
            name,
            cnic,
            age,
            chatWindow: newChatWindow._id // Associate the new chat window with the patient
        });

        // Update the patient reference in the chat window
        newChatWindow.patient = newPatient._id;
        await newChatWindow.save();

        // Save the patient to the database
        await newPatient.save();

        // Respond with the newly created patient and chat window
        res.status(201).json({
            message: 'Patient and chat window created successfully.',
            patient: newPatient,
            chatWindow: newChatWindow
        });
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};







exports.viewPatient = async (req, res) => {
    try {
        const patientId = req.params.patientId;
        const doctorId = req.user.id; // Make sure to use the correct property

        // Find the patient by ID
        const patient = await Patient.findById(patientId);

        // Check if patient exists
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found.' });
        }

        // Check if the authenticated doctor is the one who created the patient
        if (!patient.doctor.equals(doctorId)) {
            return res.status(403).json({ message: 'Unauthorized access to this patient.' });
        }

        // Respond with patient details
        res.status(200).json({
            name: patient.name,
            cnic: patient.cnic,
            age: patient.age,
            id: patient._id,
        });
    } catch (error) {
        console.error('Error viewing patient:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};


exports.getAllPatients = async (req, res) => {
    try {
        const doctorId = req.user.id; // Get the authenticated doctor's ID

        // Find all patients associated with the doctor
        const patients = await Patient.find({ doctor: doctorId }).select('name cnic age _id');

        // Check if there are any patients
        if (patients.length === 0) {
            return res.status(404).json({ message: 'No patients found for this doctor.' });
        }

        // Respond with the list of patients
        res.status(200).json({ patients });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};



// Controller function to view patient chat history
exports.viewPatientChat = async (req, res) => {
    try {
        const doctorId = req.user._id; // Extracting doctor's ID from request user
        const patientId = req.params.id; // Patient ID from route params

        console.log("doctor id", doctorId);
        console.log("patient id", patientId);

        // Find the patient by ID and populate the associated doctor
        const patient = await Patient.findById(patientId);

        console.log('Patient found:', patient); // Log patient details

        // Check if patient exists and if the doctor has access
        if (!patient || !patient.canViewDetails(doctorId)) {
            return res.status(403).json({ message: 'Access denied or patient not found.' });
        }

        // Find the chat associated with the patient
        const chat = await Chat.findOne({ patient: patientId }).populate('messages');

        console.log('Chat found:', chat); // Log chat details

        // Check if chat exists
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found.' });
        }

        // Check if messages array is empty
        if (chat.messages.length === 0) {
            return res.status(200).json({ message: 'No messages found for this chat.' });
        }

        // Respond with chat messages
        res.status(200).json(chat.messages);
    } catch (error) {
        console.error('Error viewing patient chat:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};




exports.viewDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.user._id; // Extract doctor's ID from request user

        console.log("doctorId ", doctorId); 
        
        // Find the doctor by ID and populate user and hospital information
        const doctor = await Doctor.findOne({ user: doctorId })
            .populate('user') // Populate user reference
            .populate('hospitalAssociated'); // Populate hospital associated if needed
        
        console.log('Doctor found:', doctor); // Log doctor details

        // Check if doctor exists
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        // Respond with doctor profile details
        res.status(200).json({
            name: doctor.user.name,
            email: doctor.user.email,
            phoneNumber: doctor.phoneNumber,
            medicalLicenseNumber: doctor.medicalLicenseNumber,
            department: doctor.department,
            specialization: doctor.specialization,
            associatedHospital: doctor.hospitalAssociated ? doctor.hospitalAssociated.name : 'Not associated with any hospital'
        });
    } catch (error) {
        console.error('Error viewing doctor profile:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};