const { ADMIN_ROLE_ID } = require("../utils/constants");

function requireAdmin(req, res, next) {
  if (!req.session?.token) return res.redirect("/auth/login");
  if (req.session.user?.roleId !== ADMIN_ROLE_ID) {
    req.session.destroy(() => res.redirect("/auth/login"));
    return;
  }
  next();
}

module.exports = { requireAdmin };
