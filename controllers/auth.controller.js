const { User } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { comparePasswords } = require("../utils/passwordUtils");
const { generateToken, parseExpiryToMs } = require("../utils/jwtUtils");
const logger = require("../utils/logger");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.is_active) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return errorResponse(res, "Invalid credentials", 401);
    }

    const isMatch = await comparePasswords(password, user.password_hash);
    if (!isMatch) {
      logger.warn(`Failed login attempt for email: ${email} (invalid password)`);
      return errorResponse(res, "Invalid credentials", 401);
    }

    const tokenPayload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    const token = generateToken(tokenPayload);

    const expiresMs = parseExpiryToMs();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresMs,
    });

    logger.info(`User logged in: ${user.email} (${user.role})`);

    return successResponse(res, "Login successful", 200, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    return errorResponse(res, "Failed to login", 500, err);
  }
};

const getMe = async (req, res) => {
  if (!req.user) {
    return errorResponse(res, "User not authenticated", 401);
  }

  return successResponse(res, "User profile", 200, {
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

const logout = async (req, res) => {
  // Clear auth cookie; frontend should also drop any stored Bearer token
  if (req.user) {
    logger.info(`User logged out: ${req.user.email}`);
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return successResponse(res, "Logout successful", 200, {
    token: null,
    user: null,
  });
};

module.exports = {
  login,
  getMe,
  logout,
};
