const router = require("express").Router();
const { asyncHandler, validate } = require("../middleware");
const { register, login } = require("../controllers/authController");
const { registerSchema, loginSchema } = require("../validation");

router.post("/register", validate(registerSchema), asyncHandler(register));
router.post("/login", validate(loginSchema), asyncHandler(login));

module.exports = router;
