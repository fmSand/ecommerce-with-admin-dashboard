const router = require("express").Router();
const api = require("../utils/apiClient");

router.get("/", async (req, res, next) => {
  try {
    const [products, orders, users, categories] = await Promise.all([
      api.get("/products", req).catch(() => ({ products: [] })),
      api.get("/orders", req).catch(() => ({ orders: [] })),
      api.get("/users", req).catch(() => ({ users: [] })),
      api.get("/categories", req).catch(() => ({ categories: [] })),
    ]);

    res.render("dashboard", {
      title: "Dashboard",
      pageTitle: "Dashboard",
      active: "dashboard",
      stats: {
        products: products.products?.length ?? 0,
        orders: orders.orders?.length ?? 0,
        users: users.users?.length ?? 0,
        categories: categories.categories?.length ?? 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
