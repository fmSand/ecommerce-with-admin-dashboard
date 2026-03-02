const router = require("express").Router();
const api = require("../utils/apiClient");

router.get("/", async (req, res, next) => {
  try {
    const data = await api.get("/memberships", req);
    res.render("memberships/index", {
      title: "Memberships",
      pageTitle: "Memberships",
      active: "memberships",
      memberships: data.memberships,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const data = await api.put(`/memberships/${req.params.id}`, req, req.body);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: "error",
      data: { result: err.message },
    });
  }
});

module.exports = router;
