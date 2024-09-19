const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');


const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const generateRefreshToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Adjust expiration
};


const storeRefreshToken = async (refreshToken, userId) => {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiry
  
    // Try to find an existing refresh token for the user
    const existingToken = await RefreshToken.findOne({ user: userId });
  
    if (existingToken) {
      // If an existing token is found, update it
      existingToken.token = refreshToken;
      existingToken.expiresAt = expiresAt;
      await existingToken.save();
    } else {
      // If no existing token is found, create a new one
      const newToken = new RefreshToken({
        user: userId,
        token: refreshToken,
        expiresAt
      });
      await newToken.save();
    }
  };
  

module.exports = { generateToken, generateRefreshToken, storeRefreshToken };
