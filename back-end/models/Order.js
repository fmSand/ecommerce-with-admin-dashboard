const ORDER_STATUS = require("../constants/orderStatus");

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      orderNumber: {
        type: DataTypes.STRING(8),
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ORDER_STATUS.IN_PROGRESS,
        validate: { isIn: [Object.values(ORDER_STATUS)] },
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
      totalAmount: {
        //consider removing?
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "orders",
      timestamps: true,
    },
  );

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "RESTRICT" });
    Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items", onDelete: "CASCADE" });
  };

  return Order;
};
