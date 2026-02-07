const router = require("express").Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/asyncHandler");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.get("/", asyncHandler(getAllCategories));
router.get("/:id", asyncHandler(getCategoryById));
router.post("/", authenticate, requireAdmin, asyncHandler(createCategory));
router.put("/:id", authenticate, requireAdmin, asyncHandler(updateCategory));
router.delete("/:id", authenticate, requireAdmin, asyncHandler(deleteCategory));
//add param validation etc

module.exports = router;
