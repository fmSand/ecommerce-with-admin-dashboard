const router = require("express").Router();
const { asyncHandler, authenticate, requireAdmin } = require("../middleware");
const { getAllStatuses } = require("../controllers/orderStatusController");

router.get("/", authenticate, requireAdmin, asyncHandler(getAllStatuses));

module.exports = router;
