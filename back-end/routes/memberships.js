const router = require("express").Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/asyncHandler");
const {
  getAllMemberships,
  getMembershipById,
  updateMembershipDiscount,
} = require("../controllers/membershipController");

router.get("/", asyncHandler(getAllMemberships));
router.get("/:id", asyncHandler(getMembershipById));
router.put("/:id", authenticate, requireAdmin, asyncHandler(updateMembershipDiscount));
//validate param etc
module.exports = router;
