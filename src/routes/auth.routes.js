const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  getAllUsers,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.get("/users", getAllUsers);

module.exports = router;

