const Joi = require("joi");

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100),
  lastName: Joi.string().trim().min(2).max(100),
  username: Joi.string().trim().pattern(/^\S+$/).min(3).max(50),
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } }),
  address: Joi.string().trim().min(1).max(255),
  city: Joi.string().trim().min(2).max(100),
  phone: Joi.string().trim().pattern(/^\d+$/).min(3).max(32),
}).min(1);

const updateRoleSchema = Joi.object({
  roleId: Joi.number().integer().positive().required(),
});

module.exports = { updateUserSchema, updateRoleSchema };
