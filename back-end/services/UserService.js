const { AppError } = require("../utils/AppError");
const { Op } = require("sequelize");

class UserService {
  constructor(db) {
    this.User = db.User;
    this.Role = db.Role;
    this.Membership = db.Membership;
    this.Order = db.Order;
  }

  async getById(userId, transaction = null) {
    const user = await this.User.findByPk(userId, {
      include: [
        { model: this.Role, as: "role" },
        { model: this.Membership, as: "membership" },
      ],
      attributes: { exclude: ["passwordHash"] },
      transaction,
    });

    if (!user) throw new AppError(404, "User not found");
    return user;
  }

  async getByUsernameOrEmail(identifier) {
    return this.User.findOne({
      where: {
        [Op.or]: [{ username: identifier }, { email: identifier }],
      },
    });
  }

  async getAll() {
    return this.User.findAll({
      include: [
        { model: this.Role, as: "role" },
        { model: this.Membership, as: "membership" },
      ],
      attributes: { exclude: ["passwordHash"] },
      order: [["createdAt", "DESC"]],
    });
  }

  async create(userData) {
    return this.User.create(userData);
  }

  async update(userId, updates) {
    const allowedFields = ["firstName", "lastName", "username", "email", "address", "city", "phone"];
    const allowed = Object.fromEntries(Object.entries(updates).filter(([key]) => allowedFields.includes(key)));

    const user = await this.User.findByPk(userId, {
      include: [
        { model: this.Role, as: "role" },
        { model: this.Membership, as: "membership" },
      ],
      attributes: { exclude: ["passwordHash"] },
    });

    if (!user) throw new AppError(404, "User not found");

    await user.update(allowed);
    return user;
  }

  async updateRole(userId, roleId) {
    const user = await this.User.findByPk(userId, {
      attributes: { exclude: ["passwordHash"] },
    });
    if (!user) throw new AppError(404, "User not found");
    await user.update({ roleId });
    return user;
  }

  async delete(userId, requestingUserId) {
    const user = await this.User.findByPk(userId);
    if (!user) throw new AppError(404, "User not found");

    if (userId === requestingUserId) {
      throw new AppError(400, "Cannot delete your own account");
    }

    const orderCount = await this.Order.count({ where: { userId } });
    if (orderCount > 0) {
      throw new AppError(400, "Cannot delete user with existing orders");
    }
    await this.User.destroy({ where: { id: userId } });
  }

  async updateUserMembership(userId, membershipId, transaction) {
    await this.User.update({ membershipId }, { where: { id: userId }, transaction });
  }

  async incrementTotalPurchasedQuantity(userId, purchasedQuantity, transaction) {
    await this.User.increment({ totalPurchasedQuantity: purchasedQuantity }, { where: { id: userId }, transaction });
    const user = await this.User.findByPk(userId, { transaction });
    return {
      membershipId: user.membershipId,
      totalPurchasedQuantity: user.totalPurchasedQuantity,
    };
  }
}

module.exports = UserService;
