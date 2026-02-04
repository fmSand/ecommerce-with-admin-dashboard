module.exports = (sequelize, DataTypes) => {
  const OrderStatus = sequelize.define(
    "OrderStatus",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "orderStatuses",
      timestamps: false,
    },
  );

  OrderStatus.associate = (models) => {
    OrderStatus.hasMany(models.Order, {
      foreignKey: "orderStatusId",
      as: "orders",
      onDelete: "RESTRICT",
    });
  };

  return OrderStatus;
};
