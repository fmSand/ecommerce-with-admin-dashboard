const { updateUserSchema, updateRoleSchema } = require("./userSchema");
const { registerSchema, loginSchema } = require("./authSchema");
const { idParamSchema, paginationSchema, quantitySchema, idParamSchema } = require("./commonSchema");
const { createBrandSchema, updateBrandSchema } = require("./brandSchema");
//category,product,membership,role?,search,order,cart

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  updateRoleSchema,
  idParamSchema,
  paginationSchema,
  quantitySchema,
  createBrandSchema,
  updateBrandSchema,
};
