module.exports = {
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
    city: "Online", //make nulable and remove? Use an actual city?
    phone: "911",
  },
};
