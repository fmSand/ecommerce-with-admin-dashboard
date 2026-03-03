const router = require("express").Router();
const { asyncHandler, validate, optionalAuth } = require("../middleware");
const { searchProducts } = require("../controllers/productController");
const { searchProductsSchema } = require("../validation");

/**
 * @swagger
 * /search:
 *   post:
 *     summary: Search for products
 *     description: |
 *       Search for products by partial name, brand name, or category name using raw SQL queries.
 *       At least one search field must be provided. Multiple fields narrow the results (AND logic).
 *
 *       - **Guest/User**: Only sees non-deleted products.
 *       - **Admin**: Sees all products including soft-deleted ones.
 *
 *       Authentication is optional.
 *     tags: [Search]
 *     security:
 *       - {}
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchRequest'
 *     responses:
 *       200:
 *         description: Search completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 statuscode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: string
 *                       example: Search completed
 *                     count:
 *                       type: integer
 *                       description: Number of products found
 *                       example: 5
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error (no search field provided)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid or expired token (only if token was provided)
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
router.post("/", optionalAuth, validate(searchProductsSchema), asyncHandler(searchProducts));
module.exports = router;
