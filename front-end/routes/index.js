const router = require("express").Router();
const { ADMIN_ROLE_ID } = require("../utils/constants");

router.get("/", (req, res) => {
  if (req.session?.token && req.session.user?.roleId === ADMIN_ROLE_ID) {
    return res.redirect("/dashboard");
  }
  return res.redirect("/auth/login");
});

module.exports = router;
