const router = require("express").Router();
const { asyncHandler, validate, authenticate, requireAdmin  } = require("../middleware");
const { getAllBrands, getBrandById, createBrand, updateBrand, deleteBrand } = require("../controllers/brandController");
const { idParamSchema, createBrandSchema, updateBrandSchema } = require("../validation");

router.get("/", asyncHandler(getAllBrands));
router.get("/:id", validate(idParamSchema, "params"), asyncHandler(getBrandById));
router.post("/", authenticate, requireAdmin, validate(createBrandSchema), asyncHandler(createBrand));
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  authenticate,
  requireAdmin,
  validate(updateBrandSchema),
  asyncHandler(updateBrand),
);
router.delete("/:id", validate(idParamSchema, "params"), authenticate, requireAdmin, asyncHandler(deleteBrand));

module.exports = router;
