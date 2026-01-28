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
        allowNull: false,
        unique: true,
      },
      discountPercent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "memberships",
      timestamps: true,
    },
  );

  Membership.associate = (models) => {
    Membership.hasMany(models.User, { foreignKey: "membershipId", as: "users", onDelete: "RESTRICT" });
  };

  return Membership;
};
