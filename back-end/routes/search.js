const router = require("express").Router();
const { asyncHandler, validate } = require("../middleware");
const { searchProducts } = require("../controllers/productController");
const { searchProductsSchema } = require("../validation");

router.post("/", validate(searchProductsSchema), asyncHandler(searchProducts));

module.exports = router;
