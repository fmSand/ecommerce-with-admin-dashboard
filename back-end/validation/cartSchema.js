const Joi = require("joi");

const addItemSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
  quantity: Joi.number().integer().min(1).max(100).optional(),
});

const updateItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).max(100).required(),
});

const productIdParamSchema = Joi.object({
  productId: Joi.number().integer().positive().required(),
});

module.exports = { addItemSchema, updateItemSchema, productIdParamSchema };
