module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define(
    "Brand",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "brands",
      timestamps: false,
    },
  );

  Brand.associate = (models) => {
    Brand.hasMany(models.Product, { foreignKey: "brandId", as: "products", onDelete: "RESTRICT" });
  };

  return Brand;
};
