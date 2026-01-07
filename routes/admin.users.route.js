const express = require("express");
const {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserActive,
  changeUserPassword,
  deleteUser,
} = require("../controllers/user.controller");
const validateRequest = require("../middleware/validation.middleware");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { idParamSchema, createUserSchema, updateUserSchema, changePasswordSchema } = require("../validators/user.validator");

const   router = express.Router();

// Only ADMINs should manage CMS users
router.use(authenticate, authorizeRoles("ADMIN"));

// List users
router.get("/", listUsers);

// Get single user
router.get("/:id", validateRequest({ params: idParamSchema }), getUserById);

// Create user
router.post("/", validateRequest({ body: createUserSchema }), createUser);

// Update user (name, role, is_active)
router.put("/:id", validateRequest({ params: idParamSchema, body: updateUserSchema }), updateUser);

// Toggle active
router.patch("/:id/toggle-active", validateRequest({ params: idParamSchema }), toggleUserActive);

// Change password
router.patch("/:id/change-password", validateRequest({ params: idParamSchema, body: changePasswordSchema }), changeUserPassword);

// Delete user
router.delete("/:id", validateRequest({ params: idParamSchema }), deleteUser);

module.exports = router;


