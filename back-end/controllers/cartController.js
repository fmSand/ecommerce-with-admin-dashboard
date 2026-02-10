const { db } = require("../models");
const CartService = require("../services/CartService");
const cartService = new CartService(db);
const CheckoutService = require("../services/CheckoutService");
const checkoutService = new CheckoutService(db);
const { success } = require("../utils/response");

async function getCart(req, res) {
  const userId = req.user.id;
  const cart = await cartService.getCartWithItems(userId);
  return success(res, 200, "Cart retrieved", { cart });
}

async function addItem(req, res) {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  const cart = await cartService.addItem(userId, productId, quantity);
  return success(res, 201, "Item added to cart", { cart });
}

async function updateCartItem(req, res) {
  const userId = req.user.id;
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await cartService.updateItemQuantity(userId, productId, quantity);
  return success(res, 200, "Cart updated", { cart });
}

async function removeCartItem(req, res) {
  const userId = req.user.id;
  const { productId } = req.params;
  const cart = await cartService.removeItem(userId, productId);
  return success(res, 200, "Item removed from cart", { cart });
}

async function checkoutCart(req, res) {
  const userId = req.user.id;
  const order = await checkoutService.checkout(userId);
  return success(res, 201, "Order created successfully", { order });
}

module.exports = {
  getCart,
  addItem,
  updateCartItem,
  removeCartItem,
  checkoutCart,
};
