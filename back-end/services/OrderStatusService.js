const { AppError } = require("../utils/AppError");

class OrderStatusService {
  constructor(db) {
    this.OrderStatus = db.OrderStatus;
  }

  async getById(id) {
    const status = await this.OrderStatus.findByPk(id);
    if (!status) throw new AppError(404, "Order status not found");
    return status;
  }

  async getByName(name, transaction = null) {
    const status = await this.OrderStatus.findOne({
      where: { name },
      transaction,
    });
    if (!status) throw new AppError(500, `Order status '${name}' not initialized`);
    return status;
  }

  async getAll() {
    return this.OrderStatus.findAll();
  }
}

module.exports = OrderStatusService;
