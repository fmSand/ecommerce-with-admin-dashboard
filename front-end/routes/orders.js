const router = require("express").Router();
const api = require("../utils/apiClient");

router.get("/", async (req, res, next) => {
  try {
    const data = await api.get("/orders", req);
    res.render("orders/index", {
      title: "Orders",
      pageTitle: "Orders",
      active: "orders",
      orders: data.orders,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const [orderData, statusData] = await Promise.all([
      api.get(`/orders/${req.params.id}`, req),
      api.get("/order-statuses", req),
    ]);

    res.render("orders/detail", {
      title: `Order #${orderData.order.orderNumber}`,
      pageTitle: `Order #${orderData.order.orderNumber}`,
      active: "orders",
      order: orderData.order,
      statuses: statusData.statuses,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/status", async (req, res) => {
  try {
    const orderStatusId = Number(req.body.orderStatusId);
    await api.put(`/orders/${req.params.id}/status`, req, { orderStatusId });
    req.session.flash = { type: "success", message: "Order status updated" };
  } catch (err) {
    req.session.flash = { type: "danger", message: err.message };
  }
  res.redirect(`/orders/${req.params.id}`);
});

module.exports = router;
