const User = require('../models/User.js');
const Doctor = require('../models/Doctor');
const mongoose = require('mongoose');
const Hospital = require('../models/Hospital');



// View profile controller
exports.viewProfile = async (req, res, next) => {
  try {
    // Assuming user ID is available in req.user (set by passport or middleware)
    const userId = req.user.id;

    // Fetch user from the database
    const user = await User.findById(userId).select('name email profileImage'); // Select only the needed fields

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    });
  } catch (err) {
    next(err);
  }
};




// Update user profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming you have user ID from authentication middleware
    const { name, profileImage } = req.body;

    // Validate inputs
    if (!name && !profileImage) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, profileImage },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        profileImage: updatedUser.profileImage,
      }
    });
  } catch (err) {
    next(err);
  }
};



exports.upgradeToDoctor = async (req, res) => {
  const userId = req.user._id; // Get user ID from authenticated user
  const { phoneNumber, gender, medicalLicenseNumber,  department, hospitalName,  cnic } = req.body;
  console.log(req.body)
  try {
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if the user is already a doctor
      if (user.role === 'doctor') {
          return res.status(400).json({ message: 'User is already a doctor' });
      }

      // Check if the required fields are provided
      if (!phoneNumber || !gender || !medicalLicenseNumber || !department || !hospitalName || !cnic) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      // Find the hospital by name
      const hospital = await User.findOne({ name: hospitalName }); // Assuming hospital has a 'name' field
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found' });
      }

      // Check if the medical license number already exists
      const existingDoctor = await Doctor.findOne({ medicalLicenseNumber });
      if (existingDoctor) {
          return res.status(400).json({ message: 'Medical license number already exists' });
      }

      // Create a new doctor document
      const newDoctor = new Doctor({
          user: userId,
          phoneNumber,
          gender,
          medicalLicenseNumber,
          department,
          cnic,
          hospitalAssociated: hospital._id, // Use the hospital's ID
          authorizationStatus: false // Initially set to false
      });

      // Save the doctor document
      await newDoctor.save();

      // Update user role to 'doctor'
      user.role = 'doctor';
      await user.save();

      res.status(200).json({ message: 'Upgrade to doctor successful', doctor: newDoctor });
  } catch (err) {
      console.error('Error upgrading user to doctor:', err);
      res.status(500).json({ message: 'Server error' });
  }
};