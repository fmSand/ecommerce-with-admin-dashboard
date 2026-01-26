const AppError = require('../utils/AppError');
const { verifyToken } = require("../utils/jwt");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(401, "Token not provided"));
  }

  try {
    req.user = verifyToken(authHeader.split(" ")[1]);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError(401, "Token expired"));
    }
    return next(new AppError(401, "Invalid token"));
  }
}

function requireAdmin(req, res, next) {
  if (req.user.roleId !== 1) {
    return next(new AppError(403, "Admin access required"));
  }
  next();
}

module.exports = { authenticate, requireAdmin };
