module.exports = {
  ORDER_STATUSES: [
    { id: 1, name: "In Progress" },
    { id: 2, name: "Ordered" },
    { id: 3, name: "Completed" },
  ],

  ROLES: [
    { id: 1, name: "Admin" },
    { id: 2, name: "User" },
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
