const User = require("../models/User.model");
const jwt = require("jsonwebtoken");

// Hardcoded superadmin credentials (intentionally hardcoded per request)
const SUPERADMIN_EMAIL = "superadmin@prosaas.local";
const SUPERADMIN_PASSWORD = "SuperSecret123!";

const SUPERADMIN_PROFILE = {
  id: "superadmin",
  name: "Super Admin",
  email: SUPERADMIN_EMAIL,
};

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

  // Debug: log incoming credentials (masked) to help troubleshoot superadmin login issues
  // NOTE: remove these logs after debugging to avoid exposing credentials in logs
  console.log('[auth.login] received email (raw):', email);
  console.log('[auth.login] received email (trimmed/lower):', typeof email === 'string' ? email.trim().toLowerCase() : email);
  console.log('[auth.login] received password length:', password ? String(password).length : 0);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Superadmin bypass (hardcoded credentials)
  // Normalize email when checking against the hardcoded superadmin
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;
  if (normalizedEmail === SUPERADMIN_EMAIL && password === SUPERADMIN_PASSWORD) {
      const token = generateToken(SUPERADMIN_PROFILE.id);
      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: SUPERADMIN_PROFILE,
          token,
        },
      });
    }

    // Check if user exists and get password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // Handle hardcoded superadmin profile
    if (req.user && req.user.userId === SUPERADMIN_PROFILE.id) {
      return res.status(200).json({
        success: true,
        data: {
          user: SUPERADMIN_PROFILE,
        },
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    // Clear the token from the client-side
    // Note: Since we're using JWT, tokens are stateless and cannot be revoked server-side
    // without maintaining a blacklist. For a simple solution, the client should delete the token.
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Public
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "name email createdAt");

    res.status(200).json({
      success: true,
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};

