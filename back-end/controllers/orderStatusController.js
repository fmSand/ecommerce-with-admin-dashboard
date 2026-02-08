const { db } = require("../models");
const OrderStatusService = require("../services/OrderStatusService");
const orderStatusService = new OrderStatusService(db);
const { success } = require("../utils/response");

async function getAllStatuses(req, res) {
  const statuses = await orderStatusService.getAll();
  return success(res, 200, "Order statuses retrieved", { statuses });
}

module.exports = {
  getAllStatuses,
};
