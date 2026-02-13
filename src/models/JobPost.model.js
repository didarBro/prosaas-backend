const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: [100, "Department cannot exceed 100 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },
    type: {
      type: String,
      required: [true, "Job type is required"],
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Remote"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    requirements: {
      type: [String],
      required: [true, "Requirements are required"],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "At least one requirement is required",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
jobPostSchema.index({ department: 1, type: 1 });
jobPostSchema.index({ createdAt: -1 });

module.exports = mongoose.model("JobPost", jobPostSchema);

