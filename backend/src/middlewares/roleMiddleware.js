// roleMiddleware.js - Middleware to check if the authenticated user has the required role.

module.exports = (roles) => (req, res, next) => {
  // Check if a user is authenticated and has a role.
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: 'Authorization denied: User not authenticated' });
  }

  // Check if the user's role is in the list of allowed roles.
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access forbidden: Insufficient role' });
  }

  // If the role is valid, proceed to the next middleware or controller.
  next();
};