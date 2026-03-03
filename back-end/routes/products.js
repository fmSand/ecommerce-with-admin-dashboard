const router = require("express").Router();
const { asyncHandler, validate, authenticate, requireAdmin, optionalAuth } = require("../middleware");
const { idParamSchema, createProductSchema, updateProductSchema } = require("../validation");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct,
} = require("../controllers/productController");

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: |
 *       Retrieve all products with brand and category names (via raw SQL JOIN).
 *       - **Guest/User**: Only sees non-deleted products (isDeleted = false).
 *       - **Admin**: Sees all products including soft-deleted ones.
 *
 *       Authentication is optional. If a valid admin token is provided, deleted products are included.
 *     tags: [Products]
 *     security:
 *       - {}
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved
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
 *                       example: Products retrieved
 *                     count:
 *                       type: integer
 *                       example: 24
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
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
router.get("/", optionalAuth, asyncHandler(getAllProducts));

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
router.get("/:id", validate(idParamSchema, "params"), optionalAuth, asyncHandler(getProductById));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: |
 *       Create a new product. Admin access required.
 *       The brandId and categoryId must reference existing brands and categories.
 *       Returns the created product with brand and category names.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequest'
 *     responses:
 *       201:
 *         description: Product created successfully
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
 *                   example: 201
 *                 data:
 *                   type: object
 *                   properties:
 *                     result:
 *                       type: string
 *                       example: Product created successfully
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or invalid reference ID (brandId/categoryId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
router.post("/", authenticate, requireAdmin, validate(createProductSchema), asyncHandler(createProduct));

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product
 *     description: |
 *       Update one or more fields of an existing product. Admin access required.
 *       At least one field must be provided. Returns the updated product with brand and category names.
 *       The isDeleted field can only be set to false (to restore a soft-deleted product).
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Product updated successfully
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
 *                       example: Product updated successfully
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *       400:
 *         description: Validation error or invalid reference ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(idParamSchema, "params"),
  validate(updateProductSchema),
  asyncHandler(updateProduct),
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Soft delete a product
 *     description: |
 *       Soft delete a product by setting isDeleted to true. The product is not permanently
 *       removed from the database. Admin access required.
 *       Soft-deleted products are hidden from Guest/User GET requests but visible to Admins.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully (soft delete)
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
 *                       example: Product deleted successfully
 *       400:
 *         description: Invalid ID parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
router.delete("/:id", authenticate, requireAdmin, validate(idParamSchema, "params"), asyncHandler(softDeleteProduct));

module.exports = router;
