const router = require("express").Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/asyncHandler");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
} = require("../controllers/productController");

router.get("/", asyncHandler(getAllProducts)); //guests can view products, add a middleware or seperate routes for /admin?
router.get("/:id", asyncHandler(getProductById)); //guests can view products, add a middleware or seperate routes for /admin?
router.post("/", authenticate, requireAdmin, asyncHandler(createProduct));
router.put("/:id", authenticate, requireAdmin, asyncHandler(updateProduct));
router.delete("/:id", authenticate, requireAdmin, asyncHandler(softDeleteProduct));
//add param validation etc

module.exports = router;
