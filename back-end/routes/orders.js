const router = require("express").Router();
const { asyncHandler, validate, authenticate, requireAdmin } = require("../middleware/");
const { idParamSchema, updateStatusSchema } = require("../validation");
const { getAllOrders, getOrderById, updateOrderStatus } = require("../controllers/orderController");

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     description: |
 *       Retrieve orders. Authentication required.
 *
 *       - **User**: Returns only their own orders with order status.
 *       - **Admin**: Returns all orders with user details and order status.
 *
 *       Orders are sorted by creation date (newest first).
 *       Line items are not included in list responses — use GET /orders/{id} for full detail.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved
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
 *                       example: Orders retrieved
 *                     orders:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OrderSummary'
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
router.get("/", authenticate, asyncHandler(getAllOrders));

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: |
 *       Retrieve a single order with its items. Authentication required.
 *
 *       - **User**: Can only view their own orders. Returns order with items and order status.
 *       - **Admin**: Can view any order. Returns order with items, order status, and user details.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order found
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
 *                       example: Order found
 *                     order:
 *                       oneOf:
 *                         - $ref: '#/components/schemas/OrderUserView'
 *                         - $ref: '#/components/schemas/OrderAdminView'
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
 *       404:
 *         description: Order not found (or user does not own this order)
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
router.get("/:id", authenticate, validate(idParamSchema, "params"), asyncHandler(getOrderById));

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     description: |
 *       Update the status of an order. Admin access required.
 *       Only the status can be changed; other order fields cannot be modified.
 *
 *       Available statuses:
 *       - 1: In Progress
 *       - 2: Ordered
 *       - 3: Completed
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatusRequest'
 *     responses:
 *       200:
 *         description: Order status updated
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
 *                       example: Order status updated
 *                     order:
 *                       $ref: '#/components/schemas/OrderSummary'
 *       400:
 *         description: Validation error or invalid reference ID (orderStatusId)
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
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenResponse'
 *       404:
 *         description: Order not found
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
  "/:id/status",
  authenticate,
  requireAdmin,
  validate(idParamSchema, "params"),
  validate(updateStatusSchema),
  asyncHandler(updateOrderStatus),
);

module.exports = router;
