const router = require("express").Router();
const { asyncHandler } = require("../middleware/asyncHandler");
const { register, login } = require("../controllers/authController");

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
//add validation middleware( Joi scheamas)

module.exports = router;
