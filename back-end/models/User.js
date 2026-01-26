//consider UUID/UUIDV4 for the id field?
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {//City
        type: DataTypes.STRING,
        allowNull: false, //true, depending on admin rewuirements
      },
      phone: { //Thelephone
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalPurchasedQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      membershipId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
      indexes: [{ fields: ["roleId"] }, { fields: ["email"] }],
    }
  );

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: "roleId", as: "role", onDelete: "RESTRICT" });
    User.belongsTo(models.Membership, { foreignKey: "membershipId", as: "membership", onDelete: "RESTRICT" });
    User.hasMany(models.Order, { foreignKey: "userId", as: "orders", onDelete: "RESTRICT" });
    User.hasOne(models.Cart, { foreignKey: "userId", onDelete: "CASCADE" });
  };

  return User;
};

