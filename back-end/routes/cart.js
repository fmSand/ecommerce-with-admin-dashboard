const router = require("express").Router();
const { asyncHandler, validate, authenticate } = require("../middleware");
const { addItemSchema, productIdParamSchema, updateItemSchema } = require("../validation");
const { getCart, addItem, updateCartItem, removeCartItem, checkoutCart } = require("../controllers/cartController");

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     description: |
 *       Retrieve the authenticated user's cart with all items and product details.
 *       If the user has no cart yet, returns an empty items array.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved
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
 *                       example: Cart retrieved
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
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
router.get("/", authenticate, asyncHandler(getCart));

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add item to cart
 *     description: |
 *       Add a product to the authenticated user's cart. Creates the cart if it doesn't exist.
 *
 *       - If the product already exists in the cart, the quantity is incremented by the specified amount (default: 1).
 *       - Validates that the product exists, is not deleted, and has sufficient stock.
 *       - Out-of-stock or deleted products cannot be added.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItemRequest'
 *     responses:
 *       201:
 *         description: Item added to cart
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
 *                       example: Item added to cart
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Validation error, product deleted, or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
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
router.post("/items", authenticate, validate(addItemSchema), asyncHandler(addItem));

/**
 * @swagger
 * /cart/items/{productId}:
 *   put:
 *     summary: Update cart item quantity
 *     description: |
 *       Set the quantity of a specific product in the authenticated user's cart to the given value.
 *       Validates that the product exists, is not deleted, and has sufficient stock.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Product ID of the cart item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateItemRequest'
 *     responses:
 *       200:
 *         description: Cart updated
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
 *                       example: Cart updated
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Validation error, product deleted, or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       404:
 *         description: Cart not found, item not in cart, or product not found
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
  "/items/:productId",
  authenticate,
  validate(productIdParamSchema, "params"),
  validate(updateItemSchema),
  asyncHandler(updateCartItem),
);

/**
 * @swagger
 * /cart/items/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove a specific product from the authenticated user's cart entirely.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Product ID of the cart item to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
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
 *                       example: Item removed from cart
 *                     cart:
 *                       $ref: '#/components/schemas/Cart'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       404:
 *         description: Cart not found or item not in cart
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
router.delete(
  "/items/:productId",
  authenticate,
  validate(productIdParamSchema, "params"),
  asyncHandler(removeCartItem),
);

/**
 * @swagger
 * /cart/checkout/now:
 *   post:
 *     summary: Checkout cart
 *     description: |
 *       Checkout the authenticated user's cart and create an order. This operation:
 *
 *       1. Validates stock availability for all items in the cart
 *       2. Snapshots the current product prices and names onto the order items
 *       3. Creates an order with a unique 8-character order number
 *       4. Computes the order total using integer-cents arithmetic and applies the membership discount
 *       5. Snapshots the user's current membership name and discount percentage onto the order for historical audit purposes
 *       6. Decrements product stock quantities
 *       7. Updates the user's total purchased quantity
 *       8. Recalculates and updates the user's membership tier if applicable
 *       9. Clears the cart
 *       10. Returns the created order with all details
 *
 *       The entire operation is wrapped in a database transaction for data integrity.
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                       example: Order created successfully
 *                     order:
 *                       $ref: '#/components/schemas/OrderUserView'
 *       400:
 *         description: Cart is empty or insufficient stock for one or more items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedResponse'
 *       404:
 *         description: Cart not found or product not found
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
router.post("/checkout/now", authenticate, asyncHandler(checkoutCart));

module.exports = router;
