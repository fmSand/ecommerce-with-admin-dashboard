const { ADMIN_ROLE_ID } = require("../utils/constants");

function requireAdmin(req, res, next) {
  if (!req.session?.token) return res.redirect("/auth/login");

  const roleId = req.session.user?.roleId;
  if (typeof roleId !== "number") {
    delete req.session.token;
    delete req.session.user;
    req.session.flash = { type: "danger", message: "Session error, please login again" };
    return req.session.save(() => res.redirect("/auth/login"));
  }
  if (roleId !== ADMIN_ROLE_ID) {
    res.status(403);
    return res.render("error", { message: "Admin privileges required" });
  }
  next();
}

module.exports = { requireAdmin };
