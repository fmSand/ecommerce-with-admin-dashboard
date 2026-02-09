const Joi = require("joi");

const searchProductsSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255),
  brand: Joi.string().trim().min(1).max(255),
  category: Joi.string().trim().min(1).max(255),
}).or("name", "brand", "category");

module.exports = { searchProductsSchema };
