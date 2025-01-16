const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using JWT
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info (from token) to the request object
    next(); // Proceed to the next middleware or controller
  } catch (error) {
    // Handle specific token-related errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    console.error('Token verification error:', error.message);
    res.status(500).json({ message: 'Failed to authenticate token.' });
  }
};

module.exports = authMiddleware;
