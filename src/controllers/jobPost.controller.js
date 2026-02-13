const JobPost = require("../models/JobPost.model");

// @desc    Create a new job post
// @route   POST /api/job-posts
// @access  Private
exports.createJobPost = async (req, res, next) => {
  try {
    const { title, department, location, type, description, requirements } =
      req.body;

    // Validation
    if (!title || !department || !location || !type || !description) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, department, location, type, and description",
      });
    }

    if (!requirements || !Array.isArray(requirements) || requirements.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one requirement",
      });
    }

    // Create job post
    const jobPost = await JobPost.create({
      title,
      department,
      location,
      type,
      description,
      requirements,
      createdBy: req.user.userId,
    });

    // Populate createdBy field
    await jobPost.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Job post created successfully",
      data: {
        jobPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all job posts
// @route   GET /api/job-posts
// @access  Public (or Private if you want to restrict)
exports.getAllJobPosts = async (req, res, next) => {
  try {
    const {
      department,
      type,
      location,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Build filter object
    const filter = {};
    if (department) filter.department = new RegExp(department, "i");
    if (type) filter.type = type;
    if (location) filter.location = new RegExp(location, "i");

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get job posts with pagination
    const jobPosts = await JobPost.find(filter)
      .populate("createdBy", "name email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await JobPost.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        jobPosts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job post by ID
// @route   GET /api/job-posts/:id
// @access  Public
exports.getJobPostById = async (req, res, next) => {
  try {
    const jobPost = await JobPost.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        message: "Job post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        jobPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job post
// @route   PUT /api/job-posts/:id
// @access  Private
exports.updateJobPost = async (req, res, next) => {
  try {
    const { title, department, location, type, description, requirements } =
      req.body;

    let jobPost = await JobPost.findById(req.params.id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        message: "Job post not found",
      });
    }

    // Check if user is the creator of the job post
    if (jobPost.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this job post",
      });
    }

    // Update fields
    if (title) jobPost.title = title;
    if (department) jobPost.department = department;
    if (location) jobPost.location = location;
    if (type) jobPost.type = type;
    if (description) jobPost.description = description;
    if (requirements) {
      if (!Array.isArray(requirements) || requirements.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Requirements must be a non-empty array",
        });
      }
      jobPost.requirements = requirements;
    }

    // Save updated job post
    jobPost = await jobPost.save();
    await jobPost.populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Job post updated successfully",
      data: {
        jobPost,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job post
// @route   DELETE /api/job-posts/:id
// @access  Private
exports.deleteJobPost = async (req, res, next) => {
  try {
    const jobPost = await JobPost.findById(req.params.id);

    if (!jobPost) {
      return res.status(404).json({
        success: false,
        message: "Job post not found",
      });
    }

    // Check if user is the creator of the job post
    if (jobPost.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job post",
      });
    }

    await jobPost.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job post deleted successfully",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

