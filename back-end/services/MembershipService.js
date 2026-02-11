const { AppError } = require("../utils/AppError");
const { Op } = require("sequelize");

class MembershipService {
  constructor(db) {
    this.Membership = db.Membership;
  }

  async getById(id, transaction = null) {
    const membership = await this.Membership.findByPk(id, { transaction });
    if (!membership) throw new AppError(404, "Membership not found");
    return membership;
  }

  async getByName(name, transaction = null) {
    const membership = await this.Membership.findOne({ where: { name }, transaction });
    if (!membership) throw new AppError(500, `Membership '${name}' not initialized`);
    return membership;
  }

  async getAll() {
    return this.Membership.findAll({ order: [["threshold", "ASC"]] });
  }

  async updateDiscount(id, discountPercent) {
    const membership = await this.Membership.findByPk(id);
    if (!membership) throw new AppError(404, "Membership not found");
    await membership.update({ discountPercent });
    return membership;
  }

  async determineMembershipTier(totalPurchasedQuantity, transaction = null) {
    const membership = await this.Membership.findOne({
      where: {
        threshold: { [Op.lte]: totalPurchasedQuantity },
      },
      order: [["threshold", "DESC"]],
      transaction,
    });
    if (!membership) {
      throw new AppError(500, "Memberships not initialized");
    }
    return membership;
  }
}

module.exports = MembershipService;
