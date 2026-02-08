const { db } = require("../models");
const AuthService = require("../services/AuthService");
const authService = new AuthService(db);
const { success } = require("../utils/response");

async function register(req, res) {
  const { username, email, password, firstName, lastName, address, city, phone } = req.body;
  const result = await authService.register({
    username,
    email,
    password,
    firstName,
    lastName,
    address,
    city,
    phone,
  });
  return success(res, 201, "User registered successfully", result);
}

async function login(req, res) {
  const { identifier, password } = req.body;
  const result = await authService.login(identifier, password);
  return success(res, 200, "Login successful", result);
}

module.exports = { register, login };
