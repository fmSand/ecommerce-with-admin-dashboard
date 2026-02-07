const router = require("express").Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/asyncHandler");
const {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

router.get("/", asyncHandler(getAllBrands));
router.get("/:id", asyncHandler(getBrandById));
router.post("/", authenticate, requireAdmin, asyncHandler(createBrand));
router.put("/:id", authenticate, requireAdmin, asyncHandler(updateBrand));
router.delete("/:id", authenticate, requireAdmin, asyncHandler(deleteBrand));
//add param validation etc

module.exports = router;
