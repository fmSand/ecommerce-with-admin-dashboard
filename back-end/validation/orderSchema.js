const Joi = require("joi");

const updateStatusSchema = Joi.object({
  orderStatusId: Joi.number().integer().positive().required(),
});

module.exports = { updateStatusSchema };
