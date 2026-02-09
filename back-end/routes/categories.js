const router = require("express").Router();
const { authenticate, validate, requireAdmin, asyncHandler } = require("../middleware");
const { idParamSchema, createCategorySchema, updateCategorySchema } = require("../validation");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.get("/", asyncHandler(getAllCategories));
router.get("/:id", validate(idParamSchema, "params"), asyncHandler(getCategoryById));
router.post("/", authenticate, requireAdmin, validate(createCategorySchema), asyncHandler(createCategory));
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(idParamSchema, "params"),
  validate(updateCategorySchema),
  asyncHandler(updateCategory),
);
router.delete("/:id", authenticate, requireAdmin, validate(idParamSchema, "params"), asyncHandler(deleteCategory));

module.exports = router;
