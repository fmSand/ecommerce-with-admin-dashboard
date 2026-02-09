const { updateUserSchema, updateRoleSchema } = require("./userSchema");
const { registerSchema, loginSchema } = require("./authSchema");
const { idParamSchema, paginationSchema, idParamSchema } = require("./commonSchema");
const { createBrandSchema, updateBrandSchema } = require("./brandSchema");
const { updateDiscountSchema } = require("./membershipSchema");
const { createCategorySchema, updateCategorySchema } = require("./categorySchema");
const { createProductSchema, updateProductSchema } = require("./productSchema");

//category,product,membership,role?,search,order,cart

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  updateRoleSchema,
  idParamSchema,
  paginationSchema,
  createBrandSchema,
  updateBrandSchema,
  updateDiscountSchema,
  createCategorySchema,
  updateCategorySchema,
  createProductSchema,
  updateProductSchema,
};
