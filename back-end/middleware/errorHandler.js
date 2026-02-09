const { error } = require("../utils/response");
const { AppError } = require("../utils/AppError");
const { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } = require("sequelize");

function toDetails(err) {
  if (!Array.isArray(err?.errors)) return undefined;
  return err.errors.map((e) => ({
    field: e.path ?? null,
    message: e.message,
  }));
}

function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV === "development") console.error(err?.stack || err);

  if (err instanceof AppError) {
    return error(res, err.statusCode, err.message, err.extraData);
  }

  if (err instanceof ValidationError) {
    return error(res, 400, "Validation error", { details: toDetails(err) });
  }

  if (err instanceof UniqueConstraintError) {
    const fieldNames = Object.keys(err.fields || {});

    const fieldMessages = {
      email: "Email already exists",
      username: "Username already exists",
      name: "Name already exists",
    };

    for (const field of fieldNames) {
      if (fieldMessages[field]) {
        return error(res, 409, fieldMessages[field], { details: toDetails(err) });
      }
    }

    return error(res, 409, "Duplicate value", { details: toDetails(err) });
  }

  if (err instanceof ForeignKeyConstraintError) {
    return error(res, 400, "Invalid reference ID");
  }

  return error(res, 500, "Internal server error");
}

module.exports = { errorHandler };
