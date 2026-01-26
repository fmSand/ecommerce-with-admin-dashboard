module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    "CartItem",
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 },
      },
      cartId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "cartItems",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["cartId", "productId"],
        },
      ],
    },
  );

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, { foreignKey: "cartId", as: "cart", onDelete: "CASCADE" });
    CartItem.belongsTo(models.Product, { foreignKey: "productId", as: "product", onDelete: "RESTRICT" });
  };

  return CartItem;
};
