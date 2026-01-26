module.exports = (sequelize, DataTypes) => {
  const Membership = sequelize.define(
    "Membership",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      threshold: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      discountPercent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "memberships",
      timestamps: false,
    }
  );

  Membership.associate = (models) => {
    Membership.hasMany(models.User, { foreignKey: "membershipId", as: "users", onDelete: "RESTRICT" });
  };

  return Membership;
};

