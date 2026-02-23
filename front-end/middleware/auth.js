const { ADMIN_ROLE_ID } = require("../utils/constants");

function requireAdmin(req, res, next) {
  if (!req.session?.token) {
    return res.redirect("/auth/login?reason=login_required");
  }
  if (req.session.user?.roleId !== ADMIN_ROLE_ID) {
    req.session.destroy(() => res.redirect("/auth/login?reason=admin_required"));
    return;
  }
  next();
}

module.exports = { requireAdmin };
