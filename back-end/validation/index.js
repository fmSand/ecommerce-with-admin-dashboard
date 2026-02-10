const { updateUserSchema, updateRoleSchema } = require("./userSchema");
const { registerSchema, loginSchema } = require("./authSchema");
const { idParamSchema, paginationSchema, idParamSchema } = require("./commonSchema");
const { createBrandSchema, updateBrandSchema } = require("./brandSchema");
const { updateDiscountSchema } = require("./membershipSchema");
const { createCategorySchema, updateCategorySchema } = require("./categorySchema");
const { createProductSchema, updateProductSchema } = require("./productSchema");
const { searchProductsSchema } = require("./searchSchema");
const { addItemSchema, updateItemSchema, productIdParamSchema } = require("./cartSchema");
const { updateStatusSchema } = require("./orderSchema");

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
  searchProductsSchema,
  addItemSchema,
  updateItemSchema,
  productIdParamSchema,
  updateStatusSchema,
};
