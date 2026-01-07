const { errorResponse } = require("../utils/apiResponse");
const logger = require("../utils/logger");
const { Sequelize } = require("sequelize");

const notFoundHandler = (req, res, next) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  errorResponse(res, `Route ${req.originalUrl} not found`, 404, null, { code: "NOT_FOUND" });
};

const errorHandler = (err, req, res, next) => {
  // Log error with context
  const errorContext = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    user: req.user ? { id: req.user.id, email: req.user.email } : null,
    body: req.body,
    params: req.params,
    query: req.query,
  };

  // Handle Sequelize errors
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message).join(", ");
    logger.warn(`Validation error: ${messages}`, { context: errorContext, error: err });
    return errorResponse(res, `Validation failed: ${messages}`, 400, err, {
      code: "VALIDATION_ERROR",
      errors: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  if (err.name === "SequelizeUniqueConstraintError") {
    const field = err.errors[0]?.path || "field";
    logger.warn(`Unique constraint violation: ${field}`, { context: errorContext, error: err });
    return errorResponse(res, `${field} already exists`, 409, err, {
      code: "UNIQUE_CONSTRAINT_ERROR",
      field,
    });
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    logger.warn(`Foreign key constraint violation`, { context: errorContext, error: err });
    return errorResponse(res, "Cannot perform operation: related record exists", 400, err, {
      code: "FOREIGN_KEY_CONSTRAINT_ERROR",
    });
  }

  if (err.name === "SequelizeDatabaseError") {
    logger.error(`Database error: ${err.message}`, { context: errorContext, error: err });
    return errorResponse(res, "Database operation failed", 500, err, {
      code: "DATABASE_ERROR",
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    logger.warn(`JWT error: ${err.message}`, { context: errorContext });
    return errorResponse(res, "Invalid or expired token", 401, err, {
      code: "JWT_ERROR",
    });
  }

  // Handle Joi validation errors (from validation middleware)
  if (err.isJoi) {
    logger.warn(`Joi validation error: ${err.message}`, { context: errorContext });
    return errorResponse(res, err.message || "Validation failed", 400, err, {
      code: "VALIDATION_ERROR",
    });
  }

  // Default error handling
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || status;

  // Log full error details
  logger.error(`Unhandled error: ${message}`, {
    context: errorContext,
    error: {
      name: err.name,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });

  // Don't expose internal error details in production
  const errorMessage = process.env.NODE_ENV === "production" && status === 500 ? "Internal Server Error" : message;

  return errorResponse(res, errorMessage, status, err instanceof Error ? err : null, {
    code,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
