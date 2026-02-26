const router = require("express").Router();
const api = require("../utils/apiClient");
const { ADMIN_ROLE_ID } = require("../utils/constants");

router.get("/login", (req, res) => {
  const reason = req.query.reason;
  const messageByReason = {
    login_required: "Please log in.",
    expired: "Session expired. Please log in again.",
    admin_required: "Admin access required.",
  };
  res.render("login", { message: messageByReason[reason] || null });
});

router.post("/login", async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.render("login", { message: "Username/Email and password required" });
    }

    const data = await api.post("/auth/login", req, {
      identifier: identifier.trim(),
      password,
    });

    const { id, email, name, roleId, token } = data;

    if (roleId !== ADMIN_ROLE_ID) {
      req.session.destroy(() => {});
      return res.render("login", { message: "Admin access required" });
    }

    req.session.regenerate((err) => {
      if (err) return next(err);
      req.session.token = token;
      req.session.user = { id, email, name, roleId };
      req.session.flash = { type: "success", message: "Welcome back!" };
      req.session.save((saveErr) => {
        if (saveErr) return next(saveErr);
        return res.redirect("/dashboard");
      });
    });
  } catch (err) {
    return res.render("login", { message: err.message || "Login failed" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/auth/login"));
});

module.exports = router;
