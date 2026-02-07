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
    //used by authservice.register
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

    const { discountPercent } = updates;
    if (discountPercent !== undefined) {
      if (discountPercent < 0 || discountPercent > 100) {
        //joi?
        throw new AppError(400, "Discount must be between 0 and 100");
      }
      await membership.update({ discountPercent });
    }
    return membership;
  }

  //delete()?

  async determineMembershipTier() {
    //for cart/checkoutservice
    //after cart checkout/new order
    //membership findOne. use Op?
    //transaction
    //return membership
  }
}

module.exports = MembershipService;
