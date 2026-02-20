const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  getAllUsers,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.get("/users", protect, getAllUsers);

module.exports = router;

