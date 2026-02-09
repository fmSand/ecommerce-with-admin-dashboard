const { AppError } = require("../utils/AppError");
const { verifyToken } = require("../utils/jwt");
const { ADMIN_ROLE_ID } = require("../constants/roles");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(401, "Token not provided"));
  }

  try {
    req.user = verifyToken(authHeader.split(" ")[1]);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError(401, "Token expired"));
    }
    return next(new AppError(401, "Invalid token"));
  }
}

function requireAdmin(req, res, next) {
  if (req.user.roleId !== ADMIN_ROLE_ID) {
    return next(new AppError(403, "Admin access required"));
  }
  next();
}

function requireSelfOrAdmin(req, res, next) {
  const targetId = Number(req.params.id);
  const isAdmin = req.user.roleId === ADMIN_ROLE_ID;
  const isSelf = req.user.id === targetId;

  if (!isAdmin && !isSelf) {
    return next(new AppError(403, "Access denied"));
  }
  next();
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }
  if (!authHeader.startsWith("Bearer ")) {
    return next(new AppError(401, "Invalid Authorization header format"));
  }

  try {
    req.user = verifyToken(authHeader.split(" ")[1]);
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError(401, "Token expired"));
    }
    return next(new AppError(401, "Invalid token"));
  }
}

module.exports = { authenticate, requireAdmin, requireSelfOrAdmin, optionalAuth };
