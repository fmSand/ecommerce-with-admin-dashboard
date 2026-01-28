module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      orderNumber: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
      },
      discountPercentAtPurchase: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      membershipNameAtPurchase: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      orderStatusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    },
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "RESTRICT" });
    Order.belongsTo(models.OrderStatus, { foreignKey: "orderStatusId", as: "orderStatus", onDelete: "RESTRICT" });
    Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items", onDelete: "CASCADE" });
  };

  return Order;
};
