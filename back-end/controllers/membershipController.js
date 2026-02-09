const { db } = require("../models");
const MembershipService = require("../services/MembershipService");
const membershipService = new MembershipService(db);
const { success } = require("../utils/response");

async function getAllMemberships(req, res) {
  const memberships = await membershipService.getAll();
  return success(res, 200, "Memberships retrieved", { memberships });
}

async function getMembershipById(req, res) {
  const { id } = req.params;
  const membership = await membershipService.getById(id);
  return success(res, 200, "Membership found", { membership });
}

async function updateMembershipDiscount(req, res) {
  const { id } = req.params;
  const { discountPercent } = req.body;
  const membership = await membershipService.updateDiscount(id, discountPercent);
  return success(res, 200, "Membership updated successfully", { membership });
}

module.exports = {
  getAllMemberships,
  getMembershipById,
  updateMembershipDiscount,
};
