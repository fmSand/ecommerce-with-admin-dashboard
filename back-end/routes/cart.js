const router = require("express").Router();
const { asyncHandler, validate, authenticate } = require("../middleware");
const { addItemSchema, productIdParamSchema, updateItemSchema } = require("../validation");
const { getCart, addItem, updateCartItem, removeCartItem, checkoutCart } = require("../controllers/cartController");

router.get("/", authenticate, asyncHandler(getCart));
router.post("/items", authenticate, validate(addItemSchema), asyncHandler(addItem));
router.put(
  "/items/:productId",
  authenticate,
  validate(productIdParamSchema, "params"),
  validate(updateItemSchema),
  asyncHandler(updateCartItem),
);
router.delete(
  "/items/:productId",
  authenticate,
  validate(productIdParamSchema, "params"),
  asyncHandler(removeCartItem),
);
router.post("/checkout/now", authenticate, asyncHandler(checkoutCart));

module.exports = router;
