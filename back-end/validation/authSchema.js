const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100).required(),
  lastName: Joi.string().trim().min(2).max(100).required(),
  username: Joi.string().trim().pattern(/^\S+$/).min(3).max(50).required(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(128).required(), //or 72 for bycrypt?
  address: Joi.string().trim().min(1).max(255).required(),
  city: Joi.string().trim().min(2).max(100).required(),
  phone: Joi.string().trim().pattern(/^\d+$/).min(3).max(32).required(),
});

const loginSchema = Joi.object({
  identifier: Joi.string().trim().min(3).max(255).required(),
  password: Joi.string().min(1).max(128).required(), //or 72 for bycrypt
});

module.exports = { registerSchema, loginSchema };
