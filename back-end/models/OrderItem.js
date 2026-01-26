module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unitPriceAtPurchase: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      productNameAtPurchase: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "orderItems",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["orderId", "productId"],
        },
      ],
    },
  );

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "orderId", as: "order", onDelete: "CASCADE" });
    OrderItem.belongsTo(models.Product, { foreignKey: "productId", as: "product", onDelete: "RESTRICT" });
  };

  return OrderItem;
};
