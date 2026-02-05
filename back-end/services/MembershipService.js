const { AppError } = require("../utils");

class MembershipService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Membership = db.Membership;
    //this.User = db.User; If admin should see user count for each membership
  }

  async getByName(name, transaction) {
    //for register authservice
    const membership = await this.Membership.findOne({
      where: { name },
      transaction,
    });
    if (!membership) throw new AppError(500, `Membership '${name}' not initialized`);
    return membership;
  }

  async getById(id, transaction = null) {
    const membership = await this.Membership.findByPk(id, { transaction });
    if (!membership) throw new AppError(404, "Membership not found");
    return membership;
  }

  async getAll() {
    return this.Membership.findAll({ order: [["threshold", "ASC"]] });
  }

  async calculateMembership() {
    //after cart checkout/new order
  }

  async update(id, updates) {
    const membership = await this.Membership.findByPk(id);
    if (!membership) throw new AppError(404, "Membership not found");
    //allow discount and maybe threshold update
  }
}

module.exports = MembershipService;
