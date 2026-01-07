const Joi = require("joi");

const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid("ADMIN", "EDITOR").required(),
  is_active: Joi.boolean().optional(),
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  role: Joi.string().valid("ADMIN", "EDITOR").optional(),
  is_active: Joi.boolean().optional(),
}).min(1);

const changePasswordSchema = Joi.object({
  password: Joi.string().min(8).max(128).required(),
});

module.exports = {
  idParamSchema,
  createUserSchema,
  updateUserSchema,
  changePasswordSchema,
};


