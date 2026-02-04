class AppError extends Error {
  constructor(statusCode, message, extraData = {}) {
    super(message);
    this.statusCode = statusCode;
    this.extraData = extraData;
  }
}

module.exports = { AppError };
