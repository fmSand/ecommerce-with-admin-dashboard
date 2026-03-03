const router = require("express").Router();
const api = require("../utils/apiClient");
const { mapFieldErrors, mapFormError } = require("../utils/formErrors");

router.get("/", async (req, res, next) => {
  try {
    const data = await api.get("/users", req);
    res.render("users/index", {
      title: "Users",
      pageTitle: "Users",
      active: "users",
      users: data.users,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [userData, rolesData] = await Promise.all([api.get(`/users/${req.params.id}`, req), api.get("/roles", req)]);

    res.render("users/detail", {
      title: userData.user.username,
      pageTitle: `User: ${userData.user.username}`,
      active: "users",
      profile: userData.user,
      roles: rolesData.roles,
      formData: null,
      fieldErrors: {},
      formError: null,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/edit", async (req, res) => {
  try {
    await api.put(`/users/${req.params.id}`, req, req.body);
    req.session.flash = { type: "success", message: "User updated" };
    return res.redirect(`/users/${req.params.id}`);
  } catch (err) {
    if (err.statusCode === 400 && err.data?.details) {
      try {
        const [userData, rolesData] = await Promise.all([
          api.get(`/users/${req.params.id}`, req),
          api.get("/roles", req),
        ]);

        return res.status(400).render("users/detail", {
          title: userData.user.username,
          pageTitle: `User: ${userData.user.username}`,
          active: "users",
          profile: userData.user,
          roles: rolesData.roles,
          formData: req.body,
          fieldErrors: mapFieldErrors(err.data.details),
          formError: mapFormError(err.data?.details),
        });
      } catch {
        if (!err.statusCode) console.error(err);
        res.status(err.statusCode || 500).json({
          status: "error",
          data: { result: err.message },
        });
      }
    }
    req.session.flash = { type: "danger", message: err.message };
    return res.redirect(`/users/${req.params.id}`);
  }
});

router.post("/:id/role", async (req, res) => {
  try {
    const roleId = Number(req.body.roleId);
    await api.put(`/users/${req.params.id}/role`, req, { roleId });
    req.session.flash = { type: "success", message: "Role updated" };
  } catch (err) {
    req.session.flash = { type: "danger", message: err.message };
  }
  res.redirect(`/users/${req.params.id}`);
});

router.post("/:id/delete", async (req, res) => {
  try {
    await api.delete(`/users/${req.params.id}`, req);
    req.session.flash = { type: "success", message: "User deleted" };
    res.redirect("/users");
  } catch (err) {
    req.session.flash = { type: "danger", message: err.message };
    res.redirect("/users");
  }
});

module.exports = router;
