const { db } = require("../models");
const CategoryService = require("../services/CategoryService");
const categoryService = new CategoryService(db);
const { success } = require("../utils/response");

async function getAllCategories(req, res) {
  const categories = await categoryService.getAll();
  return success(res, 200, "Categories retrieved", { categories });
}

async function getCategoryById(req, res) {
  const { id } = req.params;
  const category = await categoryService.getById(id);
  return success(res, 200, "Category found", { category });
}

async function createCategory(req, res) {
  const { name } = req.body;
  const category = await categoryService.create(name);
  return success(res, 201, "Category created successfully", { category });
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const category = await categoryService.update(id, name);
  return success(res, 200, "Category updated successfully", { category });
}

async function deleteCategory(req, res) {
  const { id } = req.params;
  await categoryService.delete(id);
  return success(res, 200, "Category deleted successfully");
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

