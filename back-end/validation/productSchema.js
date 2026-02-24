const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).required(),
  description: Joi.string().trim().max(2000).required(),
  unitPrice: Joi.number().positive().precision(2).required(),
  quantity: Joi.number().integer().min(0).required(),
  imgUrl: Joi.string().uri().required(),
  dateAdded: Joi.date().iso().optional(),
  brandId: Joi.number().integer().positive().required().messages({
    "number.base": "Please select a brand",
    "number.positive": "Please select a brand",
    "any.required": "Please select a brand",
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    "number.base": "Please select a category",
    "number.positive": "Please select a category",
    "any.required": "Please select a category",
  }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255),
  description: Joi.string().trim().max(2000),
  unitPrice: Joi.number().positive().precision(2),
  quantity: Joi.number().integer().min(0),
  imgUrl: Joi.string().uri(),
  dateAdded: Joi.date().iso(),
  brandId: Joi.number().integer().positive().messages({
    "number.base": "Please select a brand",
    "number.positive": "Please select a brand",
  }),
  categoryId: Joi.number().integer().positive().messages({
    "number.base": "Please select a category",
    "number.positive": "Please select a category",
  }),
  isDeleted: Joi.boolean().valid(false),
}).min(1);

module.exports = { createProductSchema, updateProductSchema };
