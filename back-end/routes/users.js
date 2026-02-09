const router = require("express").Router();
const { asyncHandler, validate, authenticate, requireAdmin, requireSelfOrAdmin } = require("../middleware");
const { updateUserSchema, updateRoleSchema, idParamSchema } = require("../validation");
const { getAllUsers, getUserById, updateUser, updateUserRole } = require("../controllers/userController");

router.get("/", authenticate, requireAdmin, asyncHandler(getAllUsers));
router.put(
  "/:id/role",
  validate(idParamSchema, "params"),
  authenticate,
  requireAdmin,
  validate(updateRoleSchema),
  asyncHandler(updateUserRole),
);
router.get("/:id", authenticate, requireSelfOrAdmin, validate(idParamSchema, "params"), asyncHandler(getUserById));
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  authenticate,
  requireSelfOrAdmin,
  validate(updateUserSchema),
  asyncHandler(updateUser),
);

module.exports = router;
