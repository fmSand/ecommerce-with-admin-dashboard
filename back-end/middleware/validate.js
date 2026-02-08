const { AppError } = require("../utils/AppError");

/**
 * https://medium.com/@artemkhrenov/the-complete-guide-to-joi-validation-in-production-node-js-applications-96acaddae056
 * https://joi.dev/api
 */
function validate(schema, property = "body") {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      errors: { wrap: { label: false } },
    });

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }));
      return next(new AppError(400, "Validation error", { details }));
    }

    req[property] = value;
    next();
  };
}

module.exports = { validate };
