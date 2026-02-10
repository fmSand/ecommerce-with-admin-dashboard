const { AppError } = require("../utils/AppError");
const { generateOrderNumber } = require("../utils/orderNumber");

class OrderService {
  constructor(db) {
    this.Order = db.Order;
    this.OrderItem = db.OrderItem;
    this.OrderStatus = db.OrderStatus;
    this.Product = db.Product;
    this.User = db.User;
  }

  async getAllForUser(userId) {
    return this.Order.findAll({
      where: { userId },
      include: [{ model: this.OrderStatus, as: "orderStatus" }],
      order: [["createdAt", "DESC"]],
    });
  }

  async getAllForAdmin() {
    return this.Order.findAll({
      include: [
        { model: this.User, as: "user", attributes: ["id", "username", "email"] },
        { model: this.OrderStatus, as: "orderStatus" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getByIdForUser(orderId, userId, transaction = null) {
    const order = await this.Order.findOne({
      where: { id: orderId, userId },
      include: [
        { model: this.OrderItem, as: "items", include: [{ model: this.Product, as: "product" }] },
        { model: this.OrderStatus, as: "orderStatus" },
      ],
      transaction,
    });

    if (!order) throw new AppError(404, "Order not found");
    return order;
  }

  async getByIdForAdmin(orderId) {
    const order = await this.Order.findByPk(orderId, {
      include: [
        { model: this.User, as: "user", attributes: ["id", "username", "email"] },
        { model: this.OrderItem, as: "items", include: [{ model: this.Product, as: "product" }] },
        { model: this.OrderStatus, as: "orderStatus" },
      ],
    });

    if (!order) throw new AppError(404, "Order not found");
    return order;
  }

  async updateStatus(orderId, orderStatusId) {
    const order = await this.Order.findByPk(orderId, {
      include: [
        { model: this.User, as: "user", attributes: ["id", "username", "email"] },
        { model: this.OrderStatus, as: "orderStatus" },
      ],
    });
    if (!order) throw new AppError(404, "Order not found");
    await order.update({ orderStatusId });
    return order;
  }

  async create(orderData, orderItems, transaction) {
    const order = await this.Order.create({ ...orderData, orderNumber: generateOrderNumber() }, { transaction });

    const itemsWithOrderId = orderItems.map((item) => ({
      ...item,
      orderId: order.id,
    }));

    await this.OrderItem.bulkCreate(itemsWithOrderId, { transaction });
    return order;
  }
}

module.exports = OrderService;
