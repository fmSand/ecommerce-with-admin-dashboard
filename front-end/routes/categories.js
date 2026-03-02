const router = require("express").Router();
const api = require("../utils/apiClient");

router.get("/", async (req, res, next) => {
  try {
    const data = await api.get("/categories", req);
    res.render("categories/index", {
      title: "Categories",
      pageTitle: "Categories",
      active: "categories",
      categories: data.categories,
      flash: req.query.flash ? { message: req.query.flash, type: req.query.type || "success" } : null,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const data = await api.post("/categories", req, req.body);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: "error",
      data: { result: err.message },
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const data = await api.put(`/categories/${req.params.id}`, req, req.body);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: "error",
      data: { result: err.message },
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await api.delete(`/categories/${req.params.id}`, req);
    res.json({ status: "success", data });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: "error",
      data: { result: err.message },
    });
  }
});

module.exports = router;
