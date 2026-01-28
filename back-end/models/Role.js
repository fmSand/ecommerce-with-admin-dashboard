module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "roles",
      timestamps: false,
    },
  );

  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: "roleId", as: "users", onDelete: "RESTRICT" });
  };

  return Role;
};
