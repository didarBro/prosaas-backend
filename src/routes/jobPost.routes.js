const express = require("express");
const router = express.Router();
const {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
} = require("../controllers/jobPost.controller");
const { protect } = require("../middlewares/auth.middleware");

// Public routes
router.get("/", getAllJobPosts);
router.get("/:id", getJobPostById);

// Protected routes (require authentication)
router.post("/", protect, createJobPost);
router.put("/:id", protect, updateJobPost);
router.delete("/:id", protect, deleteJobPost);

module.exports = router;

