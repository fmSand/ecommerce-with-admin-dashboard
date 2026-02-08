const Joi = require("joi");

const idParam = Joi.object({
  id: Joi.number().integer().min(1).required(),
});

const pagination = {
  //if i add later
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
};

const quantity = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

module.exports = { idParam, pagination, quantity };
