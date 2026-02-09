const Joi = require("joi");

const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const paginationSchema = {
  //if i add later
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
};

const quantitySchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

module.exports = { idParamSchema, paginationSchema, quantitySchema };
