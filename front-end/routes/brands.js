const router = require("express").Router();
const api = require("../utils/apiClient");

router.get("/", async (req, res, next) => {
  try {
    const data = await api.get("/brands", req);
    res.render("brands/index", {
      title: "Brands",
      pageTitle: "Brands",
      active: "brands",
      brands: data.brands,
      flash: req.query.flash ? { message: req.query.flash, type: req.query.type || "success" } : null,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const data = await api.post("/brands", req, req.body);
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
    const data = await api.put(`/brands/${req.params.id}`, req, req.body);
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
    await api.delete(`/brands/${req.params.id}`, req);
    res.json({ status: "success", data: { result: "Brand deleted successfully" } });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      status: "error",
      data: { result: err.message },
    });
  }
});

module.exports = router;
