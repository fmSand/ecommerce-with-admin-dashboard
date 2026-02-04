const { ADMIN_ROLE_ID, USER_ROLE_ID, ADMIN_ROLE_NAME, USER_ROLE_NAME } = require("./roles");

module.exports = {
  ORDER_STATUSES: [
    { id: 1, name: "In Progress" },
    { id: 2, name: "Ordered" },
    { id: 3, name: "Completed" },
  ],

  ROLES: [
    { id: ADMIN_ROLE_ID, name: ADMIN_ROLE_NAME },
    { id: USER_ROLE_ID, name: USER_ROLE_NAME },
  ],

  MEMBERSHIPS: [
    { name: "Bronze", threshold: 0, discountPercent: 0 },
    { name: "Silver", threshold: 15, discountPercent: 15 },
    { name: "Gold", threshold: 30, discountPercent: 30 },
  ],

  ADMIN_USER: {
    username: "Admin",
    password: "P@ssword2023",
    email: "admin@noroff.no",
    firstName: "Admin",
    lastName: "Support",
    address: "Online",
    city: "Norway",
    phone: "911",
  },
};
