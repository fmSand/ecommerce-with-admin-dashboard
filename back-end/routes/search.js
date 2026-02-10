const router = require("express").Router();
const { asyncHandler, validate, optionalAuth } = require("../middleware");
const { searchProducts } = require("../controllers/productController");
const { searchProductsSchema } = require("../validation");

router.post("/", optionalAuth, validate(searchProductsSchema), asyncHandler(searchProducts));
module.exports = router;
