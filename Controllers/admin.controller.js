const Hospital = require('../models/Hospital'); // Assuming you have the Hospital model path
const mongoose = require('mongoose');

// Controller to view all unauthorized hospitals
exports.viewUnauthorizedHospitals = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Find all hospitals where authorizationStatus is false (unauthorized)
    const unauthorizedHospitals = await Hospital.find({ authorizationStatus: false }).populate('user', 'name email profileImage');

    res.status(200).json({
      message: 'Unauthorized hospitals fetched successfully',
      unauthorizedHospitals
    });
  } catch (err) {
    console.error('Error fetching unauthorized hospitals:', err);
    res.status(500).json({ message: 'Server error' });
  }
};






// controllers/adminController.js

exports.viewAuthorizedHospitals = async (req, res) => {
  try {
    // Find all hospitals that have authorizationStatus set to true
    const authorizedHospitals = await Hospital.find({ authorizationStatus: true }).populate('user', 'name email profileImage');

    // If no hospitals are found, return a message
    if (!authorizedHospitals || authorizedHospitals.length === 0) {
      return res.status(404).json({ message: 'No authorized hospitals found' });
    }

    // Return the list of authorized hospitals
    res.status(200).json({
      message: 'Authorized hospitals fetched successfully',
      authorizedHospitals
    });
  } catch (error) {
    console.error('Error fetching authorized hospitals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};





// controllers/adminController.js

exports.authorizeHospital = async (req, res) => {
  try {
    const { hospitalId } = req.body;

    // Validate that the hospital ID is provided
    if (!hospitalId) {
      return res.status(400).json({ 
        error: true, 
        message: 'Hospital ID is required. Please provide a valid hospital ID.' 
      });
    }

    // Validate the hospitalId format (Optional: if using Mongoose, can check if the ID is valid)
    if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid hospital ID format. Please provide a valid hospital ID.',
      });
    }

    // Find the hospital by ID
    const hospital = await Hospital.findById(hospitalId);

    // Check if the hospital exists
    if (!hospital) {
      return res.status(404).json({
        error: true,
        message: 'Hospital not found. Please check the hospital ID and try again.'
      });
    }

    // Check if the hospital is already authorized
    if (hospital.authorizationStatus === true) {
      return res.status(400).json({
        error: true,
        message: 'Hospital is already authorized.'
      });
    }

    // Authorize the hospital by updating the authorization status
    hospital.authorizationStatus = true;
    await hospital.save();

    return res.status(200).json({
      error: false,
      message: 'Hospital authorized successfully',
      hospital,
    });

  } catch (error) {
    // Log the error for server-side debugging
    console.error('Error authorizing hospital:', error);

    // Handle specific Mongoose/MongoDB errors (e.g., validation, cast errors)
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: true,
        message: 'Invalid hospital ID. Please provide a valid ID.',
      });
    }

    // General server error response
    return res.status(500).json({
      error: true,
      message: 'An unexpected server error occurred while authorizing the hospital. Please try again later.'
    });
  }
};









// controllers/adminController.js

exports.unauthorizeHospital = async (req, res) => {
  try {
    const { hospitalId } = req.body; // Get the hospital ID from the request body

    // Validate that the hospital ID is provided
    if (!hospitalId) {
      return res.status(400).json({ 
        error: true, 
        message: 'Hospital ID is required. Please provide a valid hospital ID.' 
      });
    }

    // Validate the hospitalId format
    if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid hospital ID format. Please provide a valid hospital ID.',
      });
    }

    // Find the hospital by ID
    const hospital = await Hospital.findById(hospitalId);

    // Check if the hospital exists
    if (!hospital) {
      return res.status(404).json({
        error: true,
        message: 'Hospital not found. Please check the hospital ID and try again.'
      });
    }

    // Check if the hospital is already unauthorized
    if (hospital.authorizationStatus === false) {
      return res.status(400).json({
        error: true,
        message: 'Hospital is already unauthorized.'
      });
    }

    // Update the authorization status to false
    hospital.authorizationStatus = false;
    await hospital.save();

    return res.status(200).json({
      error: false,
      message: 'Hospital unauthorized successfully',
      hospital,
    });

  } catch (error) {
    // Log the error for server-side debugging
    console.error('Error unauthorized hospital:', error);

    // Handle specific Mongoose/MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: true,
        message: 'Invalid hospital ID. Please provide a valid ID.',
      });
    }

    // General server error response
    return res.status(500).json({
      error: true,
      message: 'An unexpected server error occurred while unauthorized the hospital. Please try again later.'
    });
  }
};






// controllers/adminController.js

exports.deleteUnauthorizedHospital = async (req, res) => {
  try {
    const { hospitalId } = req.body; // Get the hospital ID from the request body

    // Validate that the hospital ID is provided
    if (!hospitalId) {
      return res.status(400).json({ 
        error: true, 
        message: 'Hospital ID is required. Please provide a valid hospital ID.' 
      });
    }

    // Validate the hospitalId format
    if (!mongoose.Types.ObjectId.isValid(hospitalId)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid hospital ID format. Please provide a valid hospital ID.',
      });
    }

    // Find the hospital by ID
    const hospital = await Hospital.findById(hospitalId);

    // Check if the hospital exists
    if (!hospital) {
      return res.status(404).json({
        error: true,
        message: 'Hospital not found. Please check the hospital ID and try again.'
      });
    }

    // Check if the hospital is unauthorized
    if (hospital.authorizationStatus === true) {
      return res.status(400).json({
        error: true,
        message: 'Hospital is authorized and cannot be deleted. Please unauthorize it first.'
      });
    }

    // Delete the hospital
    await Hospital.findByIdAndDelete(hospitalId);

    return res.status(200).json({
      error: false,
      message: 'Unauthorized hospital deleted successfully',
    });

  } catch (error) {
    // Log the error for server-side debugging
    console.error('Error deleting unauthorized hospital:', error);

    // Handle specific Mongoose/MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: true,
        message: 'Invalid hospital ID. Please provide a valid ID.',
      });
    }

    // General server error response
    return res.status(500).json({
      error: true,
      message: 'An unexpected server error occurred while deleting the hospital. Please try again later.'
    });
  }
};
