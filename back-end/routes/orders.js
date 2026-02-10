const router = require("express").Router();
const { asyncHandler, validate, authenticate, requireAdmin } = require("../middleware/");
const { idParamSchema, updateStatusSchema } = require("../validation");
const { getAllOrders, getOrderById, updateOrderStatus } = require("../controllers/orderController");

router.get("/", authenticate, asyncHandler(getAllOrders));
router.get("/:id", authenticate, validate(idParamSchema, "params"), asyncHandler(getOrderById));
router.put(
  "/:id/status",
  authenticate,
  requireAdmin,
  validate(idParamSchema, "params"),
  validate(updateStatusSchema),
  asyncHandler(updateOrderStatus),
);

module.exports = router;
