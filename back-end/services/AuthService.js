const { hashPassword, verifyPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

class AuthService {
  constructor(db) {
    this.sequelize = db.sequelize;
    //this.Membership = db.Membership;
    //this.userService = this.userService;
    //this.user = db.User;
  }

  async register(userData) {
    //const bronze = await memmbershipservice getbyname?
    ///const passwordHash = await hashPassword(userData.password);
    //const user = await this.user.create //this.userService.create({username, email, passwordHash, roleid etc
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

  //username || email + password,
  async login(username, email, password) {
    //get username or email
    //if not found throw error
    //verify password with hash, if not match throw error
    //generate token with user id, email and role,
    //return user data + token
  }


  //logout()?

}

module.exports = AuthService;
