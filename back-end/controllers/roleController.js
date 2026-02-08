const { db } = require("../models");
const RoleService = require("../services/RoleService");
const roleService = new RoleService(db);
const { success } = require("../utils/response");

async function getAllRoles(req, res) {
  const roles = await roleService.getAll();
  return success(res, 200, "Roles retrieved", { roles });
}

async function getRoleById(req, res) {
  const { id } = req.params;
  const role = await roleService.getById(id);
  return success(res, 200, "Role found", { role });
}

module.exports = {
  getAllRoles,
  getRoleById,
};
