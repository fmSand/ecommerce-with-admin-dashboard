const { db } = require("../models");
const ProductService = require("../services/ProductService");
const productService = new ProductService(db);
const { success } = require("../utils/response");
const { ADMIN_ROLE_ID } = require("../constants/roles");

async function getAllProducts(req, res) {
  const isAdmin = req.user?.roleId === ADMIN_ROLE_ID;
  const products = await productService.getAll({
    includeDeleted: isAdmin,
  });
  return success(res, 200, "Products retrieved", {
    count: products.length,
    products,
  });
}

async function getProductById(req, res) {
  const product = await productService.getById(req.params.id, { includeDeleted: false });
  return success(res, 200, "Product found", { product });
}

async function createProduct(req, res) {
  const { name, description, unitPrice, quantity, imgUrl, dateAdded, brandId, categoryId } = req.body;

  const product = await productService.create({
    name,
    description,
    unitPrice,
    quantity,
    imgUrl,
    dateAdded: dateAdded || new Date(),
    brandId,
    categoryId,
  });
  return success(res, 201, "Product created successfully", { product });
}

async function updateProduct(req, res) {
  const { id } = req.params;
  const updates = req.body;
  const product = await productService.update(id, updates);
  return success(res, 200, "Product updated successfully", { product });
}

async function softDeleteProduct(req, res) {
  const { id } = req.params;
  await productService.softDelete(id);
  return success(res, 200, "Product deleted successfully");
}

async function searchProducts(req, res) {
  const products = await productService.search(req.body);
  return success(res, 200, "Search completed", {
    count: products.length,
    products,
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
  searchProducts,
};
