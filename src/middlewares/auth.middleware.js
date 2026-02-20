const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Validate user still exists (optional but recommended)
      // Skip for superadmin
      if (decoded.userId !== "superadmin") {
        const user = await User.findById(decoded.userId);
        if (!user) {
          return res.status(401).json({
            success: false,
            message: "User not found. Please log in again.",
          });
        }
      }

      // Get user from token
      req.user = {
        userId: decoded.userId,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }
  } catch (error) {
    next(error);
  }
};


