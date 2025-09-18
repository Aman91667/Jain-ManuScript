// middlewares/adminMiddleware.js
// This middleware ensures the user has an 'admin' role before proceeding.

module.exports = (req, res, next) => {
    // Check if the user object was attached by the authentication middleware
    if (req.user && req.user.role === 'admin') {
        // If the user is an admin, proceed to the next handler
        next();
    } else {
        // If not an admin, send a 403 Forbidden response
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};