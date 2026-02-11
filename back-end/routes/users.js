const router = require("express").Router();
const { asyncHandler, validate, authenticate, requireAdmin, requireSelfOrAdmin } = require("../middleware");
const { updateUserSchema, updateRoleSchema, idParamSchema } = require("../validation");
const { getAllUsers, getUserById, updateUser, updateUserRole, deleteUser } = require("../controllers/userController");

router.get("/", authenticate, requireAdmin, asyncHandler(getAllUsers));
router.put(
  "/:id/role",
  authenticate,
  requireAdmin,
  validate(idParamSchema, "params"),
  validate(updateRoleSchema),
  asyncHandler(updateUserRole),
);
router.get("/:id", authenticate, requireSelfOrAdmin, validate(idParamSchema, "params"), asyncHandler(getUserById));
router.put(
  "/:id",
  authenticate,
  requireSelfOrAdmin,
  validate(idParamSchema, "params"),
  validate(updateUserSchema),
  asyncHandler(updateUser),
);
router.delete("/:id", authenticate, requireAdmin, validate(idParamSchema, "params"), asyncHandler(deleteUser));

module.exports = router;
