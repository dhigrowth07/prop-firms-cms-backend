const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION } = require("../config/env.config");

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment config");
}

if (!JWT_EXPIRATION) {
  throw new Error("JWT_EXPIRATION is not defined in environment config");
}

const generateToken = (payload, expiresIn = JWT_EXPIRATION) => {
  if (!payload) throw new Error("Payload is required to generate token");

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  if (!token) throw new Error("Token is required to verify");

  return jwt.verify(token, JWT_SECRET);
};

const refreshToken = (token) => {
  const payload = verifyToken(token);
  delete payload.iat;
  delete payload.exp;

  return generateToken(payload);
};

const parseExpiryToMs = (exp = "1h") => {
  const unit = exp.replace(/[0-9]/g, "").toLowerCase();
  const amount = parseInt(exp, 10);
  switch (unit) {
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000;
  }
};


module.exports = {
  generateToken,
  verifyToken,
  refreshToken,
  parseExpiryToMs
};
