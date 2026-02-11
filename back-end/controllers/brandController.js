const { brandService } = require("../services");
const { success } = require("../utils/response");

async function getAllBrands(req, res) {
  const brands = await brandService.getAll();
  return success(res, 200, "Brands retrieved", { brands });
}

async function getBrandById(req, res) {
  const { id } = req.params;
  const brand = await brandService.getById(id);
  return success(res, 200, "Brand found", { brand });
}

async function createBrand(req, res) {
  const { name } = req.body;
  const brand = await brandService.create(name);
  return success(res, 201, "Brand created successfully", { brand });
}

async function updateBrand(req, res) {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await brandService.update(id, name);
  return success(res, 200, "Brand updated successfully", { brand });
}

async function deleteBrand(req, res) {
  const { id } = req.params;
  await brandService.delete(id);
  return success(res, 200, "Brand deleted successfully");
}

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
