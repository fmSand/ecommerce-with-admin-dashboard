const router = require("express").Router();
const { asyncHandler, validate, authenticate, requireAdmin } = require("../middleware");
const { idParamSchema, updateDiscountSchema } = require("../validation");
const {
  getAllMemberships,
  getMembershipById,
  updateMembershipDiscount,
} = require("../controllers/membershipController");

router.get("/", asyncHandler(getAllMemberships));
router.get("/:id", validate(idParamSchema, "params"), asyncHandler(getMembershipById));
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(idParamSchema, "params"),
  validate(updateDiscountSchema),
  asyncHandler(updateMembershipDiscount),
);

module.exports = router;
