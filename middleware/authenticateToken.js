const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // Ensure 'Authorization' header exists
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract token from header
  const token = authHeader.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err); // Optional: log the error
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateToken;
