const { QueryTypes } = require("sequelize");
const { AppError } = require("../utils");

class ProductService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Product = db.Product;
    this.Brand = db.Brand;
    this.Category = db.Category;
  }

  async getAll({ includeDeleted = false } = {}) {
    const deletedClause = includeDeleted ? "" : "WHERE p.isDeleted = 0";

    const products = await this.sequelize.query(
      `
      SELECT
        p.id,
        p.name,
        p.description,
        p.unitPrice,
        p.quantity,
        p.imgUrl,
        p.dateAdded,
        p.isDeleted,
        p.createdAt,
        p.brandId,
        p.categoryId,
        b.name AS brand,
        c.name AS category
      FROM products p
      INNER JOIN brands b ON p.brandId = b.id
      INNER JOIN categories c ON p.categoryId = c.id
      ${deletedClause}
      ORDER BY p.id ASC
      `,
      { type: QueryTypes.SELECT },
    );

    return products;
  }

  async getById(id, { includeDeleted = false } = {}) {
    const where = includeDeleted ? { id } : { id, isDeleted: false };

    const product = await this.Product.findOne({
      where,
      include: [
        { model: this.Brand, as: "brand", attributes: ["name"] },
        { model: this.Category, as: "category", attributes: ["name"] },
      ],
    });

    if (!product) throw new AppError(404, "Product not found");
    return product;
  }

  async create(productData) {
    const { name, description, unitPrice, imgUrl, quantity, brandId, categoryId, dateAdded } = productData;

    return this.Product.create({
      name,
      description,
      unitPrice,
      imgUrl,
      quantity,
      brandId,
      categoryId,
      dateAdded: dateAdded ?? new Date(),
    });
  }

  async update(id, updates) {
    const { isDeleted, ...safeUpdates } = updates;
    await this.Product.update(safeUpdates, { where: { id } });
    return this.getById(id);
  }

  async softDelete(id) {
    const product = await this.Product.findByPk(id);
    if (!product) throw new AppError(404, "Product not found");
    await product.update({ isDeleted: true });
  }

  // product stock handling

  async search({ name, brand, category }) {
    let sql = `
      SELECT
        p.id,
        p.name,
        p.description,
        p.unitPrice,
        p.quantity,
        p.imgUrl,
        p.dateAdded,
        p.isDeleted,
        p.createdAt,
        p.brandId,
        p.categoryId,
        b.name AS brand,
        c.name AS category
      FROM products p
      INNER JOIN brands b ON p.brandId = b.id
      INNER JOIN categories c ON p.categoryId = c.id
      WHERE p.isDeleted = 0
    `;

    const replacements = {};

    if (name) {
      sql += ` AND p.name LIKE :name`;
      replacements.name = `%${name}%`;
    }

    if (brand) {
      sql += ` AND b.name LIKE :brand`;
      replacements.brand = `%${brand}%`;
    }

    if (category) {
      sql += ` AND c.name LIKE :category`;
      replacements.category = `%${category}%`;
    }

    const products = await this.sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
    });

    return products;
  }
  //add pagination if time
}

module.exports = ProductService;
