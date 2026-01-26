module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "carts",
      timestamps: true,
    },
  );

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
    Cart.hasMany(models.CartItem, { foreignKey: "cartId", as: "items", onDelete: "CASCADE" });
  };

  return Cart;
};
