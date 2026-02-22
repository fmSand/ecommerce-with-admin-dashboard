const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().trim().allow("", null).max(2000).optional(),
  unitPrice: Joi.number().positive().precision(2).required(),
  quantity: Joi.number().integer().min(0).required(),
  imgUrl: Joi.string().uri().allow("", null).optional(),
  dateAdded: Joi.date().iso().optional(),
  brandId: Joi.number().integer().positive().required(),
  categoryId: Joi.number().integer().positive().required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255),
  description: Joi.string().trim().allow("", null).max(2000),
  unitPrice: Joi.number().positive().precision(2),
  quantity: Joi.number().integer().min(0),
  imgUrl: Joi.string().uri().allow("", null),
  dateAdded: Joi.date().iso(),
  brandId: Joi.number().integer().positive(),
  categoryId: Joi.number().integer().positive(),
  isDeleted: Joi.boolean(),
}).min(1);

module.exports = { createProductSchema, updateProductSchema };
