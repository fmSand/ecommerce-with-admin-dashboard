require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const db = require("./models");
const { AppError } = require("./utils/AppError");
const { errorHandler } = require("./middleware");

// ROUTE IMPORTS
const initRouter = require("./routes/init");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const brandsRouter = require("./routes/brands");
const categoriesRouter = require("./routes/categories");
const cartRouter = require("./routes/cart");
const ordersRouter = require("./routes/orders");
const orderStatusesRouter = require("./routes/orderStatuses");
const membershipsRouter = require("./routes/memberships");
const rolesRouter = require("./routes/roles");
const searchRouter = require("./routes/search");

// DB SYNC
db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced");
  })
  .catch((err) => {
    console.error("Database sync failed:", err);
    process.exit(1);
  });

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ROUTES
app.use("/init", initRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/brands", brandsRouter);
app.use("/categories", categoriesRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/order-statuses", orderStatusesRouter);
app.use("/memberships", membershipsRouter);
app.use("/roles", rolesRouter);
app.use("/search", searchRouter);

// ERROR HANDLING
app.use((req, res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
