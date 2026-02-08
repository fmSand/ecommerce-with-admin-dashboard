const { AppError } = require("../utils/AppError");

class MembershipService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Membership = db.Membership;
    //this.User = db.User; If admin should see user count for each membership
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

  async updateDiscount(id, updates) {
    const membership = await this.Membership.findByPk(id);
    if (!membership) throw new AppError(404, "Membership not found");
    await membership.update({ discountPercent: updates.discountPercent });
    return membership;
  }

  //delete()?

  async determineMembershipTier(totalPurchasedQuantity, transaction) {
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
