module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dateAdded: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      brandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "products",
      timestamps: true,
    },
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Brand, {
      foreignKey: "brandId",
      as: "brand",
      onDelete: "RESTRICT",
    });
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
      onDelete: "RESTRICT",
    });
    Product.hasMany(models.CartItem, {
      foreignKey: "productId",
      as: "cartItems",
      onDelete: "RESTRICT",
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: "productId",
      as: "orderItems",
      onDelete: "RESTRICT",
    });
  };

  return Product;
};
