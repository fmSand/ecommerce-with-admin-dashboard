const { AppError } = require("../utils/AppError");
const { Op } = require("sequelize");

class UserService {
  constructor(db) {
    this.User = db.User;
    this.Role = db.Role;
    this.Membership = db.Membership;
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

  //delete user(?)

  async updateUserMembership(userId, membershipId, transaction) {
    const user = await this.User.findByPk(userId, { transaction });
    if (!user) throw new AppError(404, "User not found");
    await user.update({ membershipId }, { transaction });
  }

  // update total purchases (for checkout).
  async updateTotalPurchasedQuantity(userId, quantityToAdd, transaction) {
    const user = await this.User.findByPk(userId, { transaction });
    if (!user) throw new AppError(404, "User not found");
    const newTotal = user.totalPurchasedQuantity + quantityToAdd;
    await user.update({ totalPurchasedQuantity: newTotal }, { transaction });
  }
}

module.exports = UserService;
