const { AppError } = require("../utils/AppError");

class OrderStatusService {
  constructor(db) {
    this.OrderStatus = db.OrderStatus;
  }

  async getAll() {
    return this.OrderStatus.findAll();
  }

  async getById(id) {
    const status = await this.OrderStatus.findByPk(id);
    if (!status) throw new AppError(404, "Order status not found");
    return status;
  }

  //internal
  async getByName() {}
}

module.exports = OrderStatusService;
