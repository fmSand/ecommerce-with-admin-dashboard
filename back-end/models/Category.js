module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "categories",
      timestamps: false,
    }
  );

  Category.associate = (models) => {
    Category.hasMany(models.Product, { foreignKey: "categoryId", as: "products", onDelete: "RESTRICT" });
  };

  return Category;
};

