const router = require("express").Router();
const { authenticate, validate, requireAdmin, asyncHandler } = require("../middleware");
const { idParamSchema, createProductSchema, updateProductSchema } = require("../validation");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
} = require("../controllers/productController");

router.get("/", asyncHandler(getAllProducts));
router.get("/:id", validate(idParamSchema, "params"), asyncHandler(getProductById));
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
//add optional auth middleware for get routes

module.exports = router;
