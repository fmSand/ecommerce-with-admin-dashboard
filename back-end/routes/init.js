const router = require("express").Router();
const db = require("../models");
const { AppError } = require("../utils/AppError");
const { initializeDatabase } = require("../services/InitService");
const { success } = require("../utils/response");

router.post("/", async (req, res, next) => {
  try {
    if (!process.env.NOROFF_PRODUCTS_URL) {
      throw new AppError(500, "NOROFF_PRODUCTS_URL is not configured");
    }

    const response = await fetch(process.env.NOROFF_PRODUCTS_URL, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new AppError(502, `Noroff API returned ${response.status}`);
    }

    const noroffData = await response.json();
    const result = await initializeDatabase(db, noroffData);

    if (result.alreadyInitialized) {
      return success(res, 200, "Database already initialized");
    }

    return success(res, 201, "Database initialized successfully");
  } catch (err) {
    if (err.name === "TimeoutError") {
      return next(new AppError(504, "Noroff API request timed out"));
    }
    next(err);
  }
});

module.exports = router;

//https://nodejsdesignpatterns.com/blog/nodejs-http-request/ - adding abortsignal and timeout error
