const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

// Controller function to view unauthorized doctors
exports.viewUnauthorizedDoctors = async (req, res) => {
    try {
        const hospitalId = req.user._id; // Extract the hospital ID from the authenticated user
console.log(hospitalId);
        // Find the hospital to ensure it exists and get the associated user
        const hospital = await Hospital.findOne({user : hospitalId});
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }

        // Find unauthorized doctors associated with this hospital
        const unauthorizedDoctors = await Doctor.find({
            hospitalAssociated: hospitalId,
            authorizationStatus: false // Only unauthorized doctors
        }).populate('user', 'name email phoneNumber'); // Populate user details, excluding password

        // Check if there are unauthorized doctors
        if (unauthorizedDoctors.length === 0) {
            return res.status(404).json({ message: 'No unauthorized doctors found.' });
        }

        // Respond with the list of unauthorized doctors
        res.status(200).json({ unauthorizedDoctors });
    } catch (error) {
        console.error('Error viewing unauthorized doctors:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};







// Controller function to view authorized doctors
exports.viewAuthorizedDoctors = async (req, res) => {
  try {
      const hospitalId = req.user._id; // Extract the hospital ID from the authenticated user
      console.log(hospitalId);
      
      // Find the hospital to ensure it exists and get the associated user
      const hospital = await Hospital.findOne({ user: hospitalId });
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found.' });
      }

      // Find authorized doctors associated with this hospital
      const authorizedDoctors = await Doctor.find({
          hospitalAssociated: hospitalId,
          authorizationStatus: true // Only authorized doctors
      }).populate('user', 'name email phoneNumber'); // Populate user details, excluding password

      // Check if there are authorized doctors
      if (authorizedDoctors.length === 0) {
          return res.status(404).json({ message: 'No authorized doctors found.' });
      }

      // Respond with the list of authorized doctors
      res.status(200).json({ authorizedDoctors });
  } catch (error) {
      console.error('Error viewing authorized doctors:', error);
      res.status(500).json({ message: 'Server error.' });
  }
};






// Controller function to authorize a doctor
exports.authorizeTheDoctor = async (req, res) => {
  try {
      const { doctorId } = req.body; // Get the doctor's ID from the request body
      const hospitalId = req.user._id; // Extract the hospital ID from the authenticated user
      
      // Find the hospital to ensure it exists and get the associated user
      const hospital = await Hospital.findOne({ user: hospitalId });
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found.' });
      }

      // Find the doctor by ID
      const doctor = await Doctor.findOne({ _id: doctorId, hospitalAssociated: hospitalId });
      if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found or not associated with this hospital.' });
      }

      // Update the authorization status of the doctor
      doctor.authorizationStatus = true; // Set to authorized
      await doctor.save();

      // Respond with success message
      res.status(200).json({ message: 'Doctor authorized successfully.', doctor });
  } catch (error) {
      console.error('Error authorizing doctor:', error);
      res.status(500).json({ message: 'Server error.' });
  }
};



// Controller function to unauthorize a doctor
exports.unauthorizeTheDoctor = async (req, res) => {
  try {
      const { doctorId } = req.body; // Get the doctor's ID from the request body
      const hospitalId = req.user._id; // Extract the hospital ID from the authenticated user
      
      // Find the hospital to ensure it exists and get the associated user
      const hospital = await Hospital.findOne({ user: hospitalId });
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found.' });
      }

      // Find the doctor by ID
      const doctor = await Doctor.findOne({ _id: doctorId, hospitalAssociated: hospitalId });
      if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found or not associated with this hospital.' });
      }

      // Update the authorization status of the doctor
      doctor.authorizationStatus = false; // Set to unauthorized
      await doctor.save();

      // Respond with success message
      res.status(200).json({ message: 'Doctor unauthorized successfully.', doctor });
  } catch (error) {
      console.error('Error unauthorized doctor:', error);
      res.status(500).json({ message: 'Server error.' });
  }
};




// Controller function to delete an unauthorized doctor
exports.deleteDoctor = async (req, res) => {
  try {
      const { doctorId } = req.body; // Get the doctor's ID from the request body
      const hospitalId = req.user._id; // Extract the hospital ID from the authenticated user
      
      // Find the hospital to ensure it exists
      const hospital = await Hospital.findOne({ user: hospitalId });
      if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found.' });
      }

      // Find the doctor by ID and ensure they are unauthorized
      const doctor = await Doctor.findOne({ _id: doctorId, hospitalAssociated: hospitalId });
      if (!doctor || doctor.authorizationStatus) {
          return res.status(404).json({ message: 'Unauthorized doctor not found or is authorized.' });
      }

      // Delete the doctor
      await Doctor.deleteOne({ _id: doctorId });

      // Respond with success message
      res.status(200).json({ message: 'Unauthorized doctor deleted successfully.' });
  } catch (error) {
      console.error('Error deleting doctor:', error);
      res.status(500).json({ message: 'Server error.' });
  }
};




// Controller function to view all authorized hospitals

exports.viewAuthorizedHospitals = async (req, res) => {
    try {
        // Find all authorized hospitals
        const authorizedHospitals = await Hospital.find({ authorizationStatus: true })
            .populate('user', 'name profileImage'); // Populate user details (e.g., name)

        // Check if there are authorized hospitals
        if (authorizedHospitals.length === 0) {
            return res.status(404).json({ message: 'No authorized hospitals found.' });
        }

        // Respond with the list of authorized hospitals
        res.status(200).json({ authorizedHospitals });
    } catch (error) {
        console.error('Error viewing authorized hospitals:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};




exports.viewHospitalProfile = async (req, res) => {
    try {
        const hospitalId = req.user._id; // Extract the hospital ID from the authenticated user
        
        // Find the hospital by ID and populate user details
        const hospital = await Hospital.findOne({ user: hospitalId }).populate('user', 'name email profileImage'); // Populate user details

        // Check if hospital exists
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }

        // Respond with hospital profile details
        res.status(200).json({
            name: hospital.user.name,
            email: hospital.user.email,
            phoneNumber: hospital.phoneNumber,
            registrationLicenseNumber: hospital.registrationLicenseNumber,
            hospitalType: hospital.hospitalType,
            address: hospital.address,
            country: hospital.country,
            websiteURL: hospital.websiteURL,
            profileImage: hospital.user.profileImage
        });
    } catch (error) {
        console.error('Error viewing hospital profile:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};
