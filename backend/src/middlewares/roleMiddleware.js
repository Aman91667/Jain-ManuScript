// backend/src/middlewares/roleMiddleware.js (Enhanced version)

/**
 * Middleware to check user role AND specifically enforce 'isApproved' status
 * for researchers.
 * This runs AFTER the `protect` middleware populates `req.user`.
 *
 * @param {string[]} allowedRoles - Array of roles allowed (e.g., ['admin', 'researcher']).
 */
module.exports = function roleMiddleware(allowedRoles = []) {
    return (req, res, next) => {
        // 1. Authentication Check (Should be handled by 'protect', but serves as a safety net)
        if (!req.user) {
            // Your existing simple roleMiddleware returned 401 here, which is fine
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const userRole = req.user.role;

        // 2. Role Check (The core function of the original simple middleware)
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: "Forbidden: You do not have the required permission." 
            });
        }
        
        // 3. CRITICAL ENHANCEMENT: Researcher Approval Check
        // If the user is a researcher, they must be approved (isApproved: true)
        if (userRole === 'researcher') {
            // Assuming req.user is populated with the boolean field 'isApproved' by the 'protect' middleware.
            if (req.user.isApproved === false) { 
                return res.status(403).json({ 
                    message: "Forbidden: Your researcher status is pending approval or has been rejected." 
                });
            }
        }
        
        // Access granted
        next();
    };
};