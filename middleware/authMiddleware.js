const { User } = require("../config/connectDB");
const { errorResponse } = require("../utils/apiResponse");
const { verifyToken } = require("../utils/jwtUtils");

const authenticate = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1].replace(/^"|"$/g, "");
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token.replace(/^"|"$/g, "");
  }

  if (!token) {
    return errorResponse(res, "Unauthorized: No token provided", 401);
  }

  try {
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id);
    if (!user || !user.is_active) {
      return errorResponse(res, "User not found or inactive", 401);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return errorResponse(res, "Token expired, please login again", 401, err);
    }
    return errorResponse(res, "Invalid or expired token", 401, err);
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "User not authenticated", 403);
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, "Forbidden: Access denied", 403);
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles,
};
