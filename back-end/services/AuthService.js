const { AppError } = require("../utils");
const { hashPassword, verifyPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");
const { USER_ROLE_ID } = require("../constants/roles");

class AuthService {
  constructor({ userService, membershipService }) {
    this.userService = userService;
    this.membershipService = membershipService;
  }

  async register(userData) {
    const bronze = await this.membershipService.getByName("Bronze");
    const passwordHash = await hashPassword(userData.password);

    const user = await this.userService.create({
      username: userData.username,
      email: userData.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address,
      city: userData.city,
      phone: userData.phone,
      totalPurchasedQuantity: 0,
      roleId: USER_ROLE_ID,
      membershipId: bronze.id,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId,
    });

    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      token,
    };
  }

  async login(identifier, password) {
    const user = await this.userService.getByUsernameOrEmail(identifier);
    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, "Invalid credentials");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      roleId: user.roleId,
    });

    return {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      //roleid
      token,
    };
  }
}

module.exports = AuthService;
