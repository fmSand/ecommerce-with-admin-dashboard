const router = require("express").Router();
const { asyncHandler, validate, authenticate, requireAdmin } = require("../middleware");
const { idParamSchema } = require("../validation");
const { getAllRoles, getRoleById } = require("../controllers/roleController");

router.get("/", authenticate, requireAdmin, asyncHandler(getAllRoles));
router.get("/:id", authenticate, requireAdmin, validate(idParamSchema, "params"), asyncHandler(getRoleById));

module.exports = router;
