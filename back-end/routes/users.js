const router = require("express").Router();
const { asyncHandler, authenticate, requireAdmin, requireSelfOrAdmin } = require("../middleware");
const { getAllUsers, getUserById, updateUser, updateUserRole } = require("../controllers/userController");

router.get("/", authenticate, requireAdmin, asyncHandler(getAllUsers));
router.put("/:id/role", authenticate, requireAdmin, asyncHandler(updateUserRole));
router.get("/:id", authenticate, requireSelfOrAdmin, asyncHandler(getUserById));
router.put("/:id", authenticate, requireSelfOrAdmin, asyncHandler(updateUser));
//validate param etc
module.exports = router;
