const { error } = require("../utils/response");
const AppError = require("../utils/AppError");
const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require("sequelize");

function toDetails(err) {
  if (!Array.isArray(err?.errors)) return undefined;

  return err.errors.map((e) => ({
    field: e.path ?? null,
    message: e.message,
  }));
}

module.exports = function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV === "development") console.error(err?.stack || err);

  if (err instanceof AppError) {
    return error(res, err.statusCode, err.message, err.extraData);
  }

  if (err instanceof ValidationError) {
    return error(res, 400, "Validation error", { details: toDetails(err) });
  }

  if (err instanceof UniqueConstraintError) {
    return error(res, 409, "Duplicate value", { details: toDetails(err) });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return error(res, 409, "Invalid reference ID");
  }

  return error(res, 500, "Internal server error");
};
