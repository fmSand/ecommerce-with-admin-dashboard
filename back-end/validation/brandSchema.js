const Joi = require("joi");

const createBrandSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
});
const updateBrandSchema = createBrandSchema;

module.exports = { createBrandSchema, updateBrandSchema };
