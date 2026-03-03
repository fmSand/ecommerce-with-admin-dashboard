const router = require("express").Router();
const { asyncHandler, validate, authenticate, requireAdmin } = require("../middleware");
const { idParamSchema, updateDiscountSchema } = require("../validation");
const {
  getAllMemberships,
  getMembershipById,
  updateMembershipDiscount,
} = require("../controllers/membershipController");

/**
 * @swagger
 * /memberships:
 *   get:
 *     summary: Get all memberships
 *     description: |
 *       Retrieve all membership tiers sorted by threshold (ascending).
 *       No authentication required.
 *
 *       Default tiers:
 *       - Bronze: 0 items threshold, 0% discount
 *       - Silver: 15 items threshold, 15% discount
 *       - Gold: 30 items threshold, 30% discount
 *     tags: [Memberships]
 *     responses:
 *       200:
 *         description: Memberships retrieved
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
 *                       example: Memberships retrieved
 *                     memberships:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Membership'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
router.get("/", asyncHandler(getAllMemberships));

/**
 * @swagger
 * /memberships/{id}:
 *   get:
 *     summary: Get a membership by ID
 *     description: Retrieve a single membership tier by its ID. No authentication required.
 *     tags: [Memberships]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Membership ID
 *     responses:
 *       200:
 *         description: Membership found
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
 *                       example: Membership found
 *                     membership:
 *                       $ref: '#/components/schemas/Membership'
 *       400:
 *         description: Invalid ID parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Membership not found
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
router.get("/:id", validate(idParamSchema, "params"), asyncHandler(getMembershipById));

/**
 * @swagger
 * /memberships/{id}:
 *   put:
 *     summary: Update membership discount
 *     description: Update the discount percentage of a membership tier. Admin access required.
 *     tags: [Memberships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Membership ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDiscountRequest'
 *     responses:
 *       200:
 *         description: Membership updated successfully
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
 *                       example: Membership updated successfully
 *                     membership:
 *                       $ref: '#/components/schemas/Membership'
 *       400:
 *         description: Validation error
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
 *         description: Membership not found
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
  validate(updateDiscountSchema),
  asyncHandler(updateMembershipDiscount),
);

module.exports = router;
