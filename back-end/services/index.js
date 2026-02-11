const db = require("../models");

const BrandService = require("./BrandService");
const CategoryService = require("./CategoryService");
const CartService = require("./CartService");
const MembershipService = require("./MembershipService");
const OrderService = require("./OrderService");
const OrderStatusService = require("./OrderStatusService");
const ProductService = require("./ProductService");
const RoleService = require("./RoleService");
const UserService = require("./UserService");

const AuthService = require("./AuthService");
const CheckoutService = require("./CheckoutService");

const brandService = new BrandService(db);
const categoryService = new CategoryService(db);
const cartService = new CartService(db);
const membershipService = new MembershipService(db);
const orderService = new OrderService(db);
const orderStatusService = new OrderStatusService(db);
const productService = new ProductService(db);
const roleService = new RoleService(db);
const userService = new UserService(db);

const authService = new AuthService({ userService, membershipService });
const checkoutService = new CheckoutService(db, {
  cartService,
  orderService,
  productService,
  userService,
  membershipService,
  orderStatusService,
});

module.exports = {
  brandService,
  categoryService,
  cartService,
  membershipService,
  orderService,
  orderStatusService,
  productService,
  roleService,
  userService,
  authService,
  checkoutService,
};
