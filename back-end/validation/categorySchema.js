const Joi = require("joi");

const createCategorySchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
});
const updateCategorySchema = createCategorySchema;

module.exports = { createCategorySchema, updateCategorySchema };
