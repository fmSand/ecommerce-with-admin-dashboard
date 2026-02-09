const Joi = require("joi");

const updateDiscountSchema = Joi.object({
  discountPercent: Joi.number().integer().min(0).max(100).required(),
});

module.exports = { updateDiscountSchema };
