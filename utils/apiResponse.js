const logger = require("./logger");

const successResponse = (res, message = "Operation successful", status = 200, data = {}) => {
  // Log successful operations at info level for important actions
  if (status === 201 || (status === 200 && (message.includes("created") || message.includes("deleted") || message.includes("updated")))) {
    logger.info(`Success: ${message}`, { status, dataKeys: Object.keys(data) });
  }

  res.status(status).json({
    success: true,
    message,
    ...data,
  });
};

const errorResponse = (res, message = "Something went wrong", status = 500, error = null, data = {}) => {
  // Log error with appropriate level
  if (status >= 500) {
    logger.error(`${status}: ${message}`, { error, data });
  } else if (status >= 400) {
    logger.warn(`${status}: ${message}`, { error, data });
  } else {
    logger.info(`${status}: ${message}`, { error, data });
  }

  const errorCode = error && typeof error === "object" && "code" in error ? error.code : status;
  const errorMessage = error && typeof error === "object" && "message" in error ? error.message : null;

  res.status(status).json({
    success: false,
    message,
    error: errorMessage,
    code: errorCode,
    ...data,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
