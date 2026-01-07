const express = require("express");
const { login, getMe, logout } = require("../controllers/auth.controller");
const validateRequest = require("../middleware/validation.middleware");
const { loginSchema } = require("../validators/auth.validator");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", validateRequest({ body: loginSchema }), login);
router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

module.exports = router;
