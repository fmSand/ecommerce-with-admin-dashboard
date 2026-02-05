const { AppError } = require("../utils/AppError");

class UserService {
  constructor(db) {
    this.sequelize = db.sequelize; //remove if not needed
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

  async update(userId) {
    //include role and membership
    //att. exclude passwordhash.
    //throw if not found
    //only allow certain fields to be updated
    //updae fields and return user
    const user = await this.User.findByPk(userId, {
      include: [
        { model: this.Role, as: "role" },
        { model: this.Membership, as: "membership" },
      ],
      attributes: { exclude: ["passwordHash"] },
    });
    if (!user) throw new AppError(404, "User not found");

    const allowedFields = ["firstName", "lastName", "userName", "email", "address", "city", "phone"];
    //loop? check undefined?
    await user.update(allowedFields);
    return user;
  }
}

module.exports = UserService;
