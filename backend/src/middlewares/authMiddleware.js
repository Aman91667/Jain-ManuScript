// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get the token from the header.
  const token = req.header('Authorization')?.split(' ')[1];

  // Check if a token exists.
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user payload to the request.
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler.
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};