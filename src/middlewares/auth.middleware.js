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

