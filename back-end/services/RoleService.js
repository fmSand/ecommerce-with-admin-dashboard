const { AppError } = require("../utils/AppError");

class RoleService {
  constructor(db) {
    this.Role = db.Role;
  }

  async getAll() {
    return this.Role.findAll();
  }

  async getById(id) {
    const role = await this.Role.findByPk(id);
    if (!role) throw new AppError(404, "Role not found");
    return role;
  }
}

module.exports = RoleService;
