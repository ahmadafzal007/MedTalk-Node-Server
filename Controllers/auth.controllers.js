const User = require('../models/User.js');
const Doctor = require('../models/Doctor.js');
const Hospital = require('../models/Hospital.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const RefreshToken = require("../models/RefreshToken.js");
const {generateToken, generateRefreshToken, storeRefreshToken} = require('../Utils/jwt.js'); // Ensure this file is in utils or similar



// Register a basic user
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, profileImage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      profileImage,
      password: hashedPassword,
      role: 'user',
    });

    await user.save();

    const accessToken = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    await storeRefreshToken(refreshToken, user._id);

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};


exports.registerDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      gender,
      medicalLicenseNumber,
      cnic,
      department,
      hospitalName,
      profileImage
    } = req.body;

    // Check if the hospital exists in the User collection
    const hospitalUser = await User.findOne({ name: hospitalName });
    if (!hospitalUser) {
      return res.status(404).json({ message: 'The specified hospital does not exist' });
    }

    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if medical license number already exists
    const existingDoctor = await Doctor.findOne({ medicalLicenseNumber });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Medical License Number already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    

    // Create a User first
    const user = new User({
      name,
      email,
      profileImage,
      password: hashedPassword,
      role: 'doctor',
    });

    await user.save();

    // Create the Doctor profile
    const doctor = new Doctor({
      user: user._id,
      phoneNumber,
      gender,
      medicalLicenseNumber,
      cnic,
      department,
      hospitalAssociated: hospitalUser._id, // Associate with the correct hospital user
    });

    await doctor.save();

    // Generate tokens
    const accessToken = generateToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);






    
    await storeRefreshToken(refreshToken, user._id);

    // Sending tokens in cookies
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    });

    // Successful response
    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    // Check for MongoDB duplicate key error and handle it
    if (err.code === 11000 && err.keyPattern.medicalLicenseNumber) {
      return res.status(400).json({ message: 'Medical License Number already registered' });
    }

    // Generic error response
    res.status(500).json({ message: 'An error occurred', error: err.message });
    next(err);
  }
};



// Register a hospital
exports.registerHospital = async (req, res, next) => {
  try {
      const { name, email, password, phoneNumber, registrationLicenseNumber, hospitalType, address, country, profileImage, websiteURL } = req.body;

      // Validate required fields
      if (!name || !email || !password || !phoneNumber || !registrationLicenseNumber || !hospitalType || !address || !country) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'Email already registered' });
      }

      // Check if registration license number already exists
      const existingHospital = await Hospital.findOne({ registrationLicenseNumber });
      if (existingHospital) {
          return res.status(400).json({ message: 'Registration license number already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a User first
      const user = new User({
          name,
          email,
          profileImage,
          password: hashedPassword,
          role: 'hospital',
      });

      await user.save();

      // Create the Hospital profile
      const hospital = new Hospital({
          user: user._id,
          phoneNumber,
          websiteURL,
          registrationLicenseNumber,
          hospitalType,
          address,
          country,
      });

      await hospital.save();

      const accessToken = generateToken(user._id, user.role);
      const refreshToken = generateRefreshToken(user._id, user.role); // Function to generate refresh token

      await storeRefreshToken(refreshToken, user._id);

      // Sending token in cookies
      res.cookie("accessToken", accessToken, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
      });

      res.cookie("refreshToken", refreshToken, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
      });

      res.status(201).json({
          message: 'Hospital registered successfully',
          hospital,
          accessToken,
          refreshToken,
      });
  } catch (err) {
      next(err);
  }
};

// 7*24*60*60*1000

// Login Controller
// Login Controller
exports.login = async (req, res, next) => {
  console.log("Login request received")
  try {
    const { email, password } = req.body;
    console.log("email", email)
    console.log("password", password);

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: user._id });
      if (!doctor.authorizationStatus) {
        return res.status(403).json({ message: 'Your access is pending' });
      }
    }

    if (user.role === 'hospital') {
      const hospital = await Hospital.findOne({ user: user._id });
      if (!hospital.authorizationStatus) {
        return res.status(403).json({ message: 'Your access is pending' });
      }
    }

    const accessToken = generateToken(user._id, user.role);
    let refreshToken = await findRefreshToken(user._id); // Check if refresh token already exists

    if (!refreshToken) {
      // If no existing refresh token, generate a new one
      refreshToken = generateRefreshToken(user._id, user.role);
    }

    // Update or store the refresh token
    await storeRefreshToken(refreshToken, user._id);

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      }
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to find existing refresh token
async function findRefreshToken(userId) {
  // Implement your logic to find the existing refresh token from the database
  // For example:
  const tokenEntry = await RefreshToken.findOne({ user: userId });
  return tokenEntry ? tokenEntry.token : null;
};






// Logout Controller
exports.logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  try {
    await RefreshToken.deleteOne({ token: refreshToken });
  } catch (error) {
    return next(error);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ user: null, auth: false });
};








// Refresh Token Controller
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not provided' });
    }

    // Verify the provided refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }

      // Check if the refresh token exists in the database
      const storedToken = await RefreshToken.findOne({ token: refreshToken });

      if (!storedToken) {
        return res.status(403).json({ message: 'Refresh token not found in database' });
      }

      // Generate new access and refresh tokens
      const newAccessToken = generateToken(decoded.id, decoded.role);
      const newRefreshToken = generateRefreshToken(decoded.id, decoded.role);

      // Update the refresh token for the user (use `user` instead of `userId`)
      await RefreshToken.updateOne(
        { user: decoded.id },  // Use the `user` field as per the schema
        { token: newRefreshToken.refreshToken, expiresAt: newRefreshToken.expiresAt },
        { upsert: true }
      );

      // Set the new tokens as cookies
      res.cookie("accessToken", newAccessToken, {
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
      });

      res.cookie("refreshToken", newRefreshToken.refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
      });

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken.refreshToken,
      });
    });
  } catch (err) {
    next(err);
  }
};
