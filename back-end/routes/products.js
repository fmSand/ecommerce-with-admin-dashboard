const router = require("express").Router();
const { asyncHandler, validate, authenticate, requireAdmin, optionalAuth } = require("../middleware");
const { idParamSchema, createProductSchema, updateProductSchema } = require("../validation");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
} = require("../controllers/productController");

router.get("/", optionalAuth, asyncHandler(getAllProducts));
router.get("/:id", validate(idParamSchema, "params"), optionalAuth, asyncHandler(getProductById));
router.post("/", authenticate, requireAdmin, validate(createProductSchema), asyncHandler(createProduct));
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(idParamSchema, "params"),
  validate(updateProductSchema),
  asyncHandler(updateProduct),
);
router.delete("/:id", authenticate, requireAdmin, validate(idParamSchema, "params"), asyncHandler(softDeleteProduct));

module.exports = router;
