const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/job-posts", require("./routes/jobPost.routes"));

app.use(errorMiddleware);

module.exports = app;
