require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const { requireAdmin } = require("./middleware/auth");

// ROUTE IMPORTS
const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const dashboardRouter = require("./routes/dashboard");
const productsRouter = require("./routes/products");
const brandsRouter = require("./routes/brands");
const categoriesRouter = require("./routes/categories");
const ordersRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const membershipsRouter = require("./routes/memberships");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 2 * 60 * 60 * 1000, sameSite: "lax" },
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  res.locals.flash = req.session?.flash || null;
  delete req.session.flash;
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use(requireAdmin);
app.use("/dashboard", dashboardRouter);
app.use("/products", productsRouter);
app.use("/brands", brandsRouter);
app.use("/categories", categoriesRouter);
app.use("/orders", ordersRouter);
app.use("/users", usersRouter);
app.use("/memberships", membershipsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err?.statusCode === 401) {
    return req.session.destroy(() => res.redirect("/auth/login?reason=expired"));
  }
  const statusCode = err.statusCode || err.status || 500;
  res.locals.status = statusCode;
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(statusCode);
  res.render("error");
});

module.exports = app;
