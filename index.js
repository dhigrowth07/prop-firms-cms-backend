const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./utils/logger");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const { MORGAN_LOG_LEVEL, NODE_ENV, VERSION } = require("./config/env.config");
const { notFoundHandler, errorHandler } = require("./middleware/errorMiddleware");
require("dotenv").config();
const { connectDB } = require("./config/connectDB");
const morganMiddleware = require("./middleware/morganMiddleware");
const apiRoutes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 5000;

const ALLOWED_ORIGINS = (process.env.CLIENT_URL || "").split(",").map((o) => o.trim().replace(/\/$/, "").toLowerCase());
logger.debug(`Allowed origins: ${JSON.stringify(ALLOWED_ORIGINS)}`);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin.replace(/\/$/, "").toLowerCase())) {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`), false);
  },
  methods: ["HEAD", "GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cookieParser());
app.use(morganMiddleware);

if (NODE_ENV === "development") {
  app.use(morgan(MORGAN_LOG_LEVEL || "dev"));
}

app.use(compression());

app.get("/", (req, res) => {
  res.status(200).send(`<h1>PROP FIRMS CMS BACKEND</h1><p>Server listening on port ${PORT}</p>`);
});

app.get("/api/ping", (req, res) => {
  res.status(200).send("ping success!");
});

//API routes
app.use(`/api/${VERSION}`, apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(PORT, async () => {
  await connectDB();
  logger.info(`[server]: Server is running at http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, err);
  server.close(() => process.exit(1));
});
