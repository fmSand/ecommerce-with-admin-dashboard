const router = require("express").Router();
const { asyncHandler, validate } = require("../middleware");
const { register, login } = require("../controllers/authController");
const { registerSchema, loginSchema } = require("../validation");

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: |
 *       Register a new user account. Username and email must be unique.
 *       Password is hashed before storage. New users are assigned the User role
 *       and Bronze membership by default. Returns a JWT token valid for 2 hours.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Validation error (missing or invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       409:
 *         description: Username or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
router.post("/register", validate(registerSchema), asyncHandler(register));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with username or email
 *     description: |
 *       Authenticate using either username or email along with password.
 *       Returns a JWT token valid for 2 hours upon successful authentication.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
router.post("/login", validate(loginSchema), asyncHandler(login));

module.exports = router;
