const router = require("express").Router();
const { authenticate, requireAdmin } = require("../middleware/auth");
const { asyncHandler } = require("../middleware/asyncHandler");
const { getAllStatuses } = require("../controllers/orderStatusController");

router.get("/", authenticate, requireAdmin, asyncHandler(getAllStatuses));

module.exports = router;
