const router = require("express").Router();
const { asyncHandler, authenticate, requireAdmin } = require("../middleware");
const { getAllStatuses } = require("../controllers/orderStatusController");

/**
 * @swagger
 * /order-statuses:
 *   get:
 *     summary: Get all order statuses
 *     description: |
 *       Retrieve all order statuses. Admin access required.
 *
 *       Default statuses:
 *       - 1: In Progress
 *       - 2: Ordered
 *       - 3: Completed
 *     tags: [Order Statuses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order statuses retrieved
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
 *                       example: Order statuses retrieved
 *                     statuses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/OrderStatus'
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
router.get("/", authenticate, requireAdmin, asyncHandler(getAllStatuses));

module.exports = router;
