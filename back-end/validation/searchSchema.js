const Joi = require("joi");

const searchProductsSchema = Joi.object({
  name: Joi.string().trim().min(1).max(255).empty(""),
  brand: Joi.string().trim().min(1).max(255).empty(""),
  category: Joi.string().trim().min(1).max(255).empty(""),
}).or("name", "brand", "category");

module.exports = { searchProductsSchema };
