const { updateUserSchema, updateRoleSchema } = require("./userSchema");
const { registerSchema, loginSchema } = require("./authSchema");
const { idParam, pagination, quantity } = require("./commonSchema");
//category,brand,product,membership,role?,search,order,cart

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  updateRoleSchema,
  idParam,
  pagination,
  quantity,
};
