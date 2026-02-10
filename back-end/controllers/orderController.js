const { db } = require("../models");
const OrderService = require("../services/OrderService");
const orderService = new OrderService(db);
const { success } = require("../utils/response");
const { ADMIN_ROLE_ID } = require("../constants/roles");

async function getAllOrders(req, res) {
  const isAdmin = req.user.roleId === ADMIN_ROLE_ID;
  const orders = isAdmin ? await orderService.getAllForAdmin() : await orderService.getAllForUser(req.user.id);
  return success(res, 200, "Orders retrieved", { orders });
}

async function getOrderById(req, res) {
  const { id } = req.params;
  const isAdmin = req.user.roleId === ADMIN_ROLE_ID;
  const order = isAdmin ? await orderService.getByIdForAdmin(id) : await orderService.getByIdForUser(id, req.user.id);
  return success(res, 200, "Order found", { order });
}

async function updateOrderStatus(req, res) {
  const { id } = req.params;
  const { orderStatusId } = req.body;
  const order = await orderService.updateStatus(id, orderStatusId);
  return success(res, 200, "Order status updated", { order });
}

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
