const { User } = require("../config/connectDB");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const { hashPassword } = require("../utils/passwordUtils");

// List all users
const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "is_active", "created_at", "updated_at"],
      order: [["created_at", "DESC"]],
    });

    return successResponse(res, "Users fetched successfully", 200, { users });
  } catch (err) {
    return errorResponse(res, "Failed to fetch users", 500, err);
  }
};

// Get single user by id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "is_active", "created_at", "updated_at"],
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "User fetched successfully", 200, { user });
  } catch (err) {
    return errorResponse(res, "Failed to fetch user", 500, err);
  }
};

// Create new CMS user
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, is_active } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return errorResponse(res, "Email already in use", 400);
    }

    const password_hash = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password_hash,
      role,
      is_active: typeof is_active === "boolean" ? is_active : true,
    });

    return successResponse(res, "User created successfully", 201, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    return errorResponse(res, "Failed to create user", 500, err);
  }
};

// Update user (name, role, is_active)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, is_active } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    await user.update({
      ...(name !== undefined && { name }),
      ...(role !== undefined && { role }),
      ...(typeof is_active === "boolean" && { is_active }),
    });

    return successResponse(res, "User updated successfully", 200, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    return errorResponse(res, "Failed to update user", 500, err);
  }
};

// Toggle active flag
const toggleUserActive = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    user.is_active = !user.is_active;
    await user.save();

    return successResponse(res, "User status updated successfully", 200, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (err) {
    return errorResponse(res, "Failed to update user status", 500, err);
  }
};

// Change user password
const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const password_hash = await hashPassword(password);
    user.password_hash = password_hash;
    await user.save();

    return successResponse(res, "User password updated successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to update user password", 500, err);
  }
};

// Delete user (hard delete, no associations today)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    await user.destroy();
    return successResponse(res, "User deleted successfully", 200);
  } catch (err) {
    return errorResponse(res, "Failed to delete user", 500, err);
  }
};

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  toggleUserActive,
  changeUserPassword,
  deleteUser,
};


