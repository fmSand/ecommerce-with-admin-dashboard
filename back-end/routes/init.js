const router = require("express").Router();
const db = require("../models");
const { AppError } = require("../utils/AppError");
const { initializeDatabase } = require("../services/InitService");
const { success } = require("../utils/response");

/**
 * @swagger
 * /init:
 *   post:
 *     summary: Initialize the database
 *     description: |
 *       Populates the database with initial data from the Products API. This endpoint should only be called once.
 *       If the database is already initialized, returns 200 with an informational message.
 *
 *       This endpoint:
 *       - Fetches product data from the Noroff API
 *       - Creates roles (Admin, User)
 *       - Creates memberships (Bronze 0%, Silver 15%, Gold 30%)
 *       - Creates order statuses (In Progress, Ordered, Completed)
 *       - Creates the initial Admin user (admin@noroff.no)
 *       - Seeds brands, categories, and products from Noroff data
 *     tags: [Init]
 *     responses:
 *       201:
 *         description: Database initialized successfully
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
 *                       example: Database initialized successfully
 *       200:
 *         description: Database already initialized
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
 *                       example: Database already initialized
 *       500:
 *         description: Server configuration error (PRODUCTS_URL not set)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 *       502:
 *         description: Products API returned an error or invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 *       504:
 *         description: Products API request timed out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalErrorResponse'
 */
router.post("/", async (req, res, next) => {
  try {
    if (!process.env.PRODUCTS_URL) {
      throw new AppError(500, "PRODUCTS_URL is not configured");
    }

    const response = await fetch(process.env.PRODUCTS_URL, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new AppError(502, `Products API returned ${response.status}`);
    }

    const noroffData = await response.json();
    const result = await initializeDatabase(db, noroffData);

    if (result.alreadyInitialized) {
      return success(res, 200, "Database already initialized");
    }

    return success(res, 201, "Database initialized successfully");
  } catch (err) {
    if (err.name === "TimeoutError") {
      return next(new AppError(504, "Products API request timed out"));
    }
    next(err);
  }
});

module.exports = router;
