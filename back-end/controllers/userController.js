const { userService } = require("../services");
const { success } = require("../utils/response");

async function getAllUsers(req, res) {
  const users = await userService.getAll();
  return success(res, 200, "Users retrieved", { users });
}

async function getUserById(req, res) {
  const user = await userService.getById(req.params.id);
  return success(res, 200, "User found", { user });
}

async function updateUser(req, res) {
  const user = await userService.update(req.params.id, req.body);
  return success(res, 200, "User updated successfully", { user });
}

async function updateUserRole(req, res) {
  const { roleId } = req.body;
  const user = await userService.updateRole(req.params.id, roleId);
  return success(res, 200, "User role updated successfully", { user });
}

async function deleteUser(req, res) {
  await userService.delete(req.params.id, req.user.id);
  return success(res, 200, "User deleted successfully");
}

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
};
