const bcrypt = require("bcrypt");

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

async function verifyPassword(input, hash) {
  return bcrypt.compare(input, hash);
}

module.exports = { hashPassword, verifyPassword };
