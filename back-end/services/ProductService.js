const { QueryTypes } = require("sequelize");
const { AppError } = require("../utils/AppError");

class ProductService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Product = db.Product;
  }

  async getAll({ includeDeleted = false } = {}) {
    const conditions = [];

    if (!includeDeleted) {
      conditions.push("p.isDeleted = 0");
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
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
      p.updatedAt,
      p.brandId,
      p.categoryId,
      b.name AS brand,
      c.name AS category
    FROM products p
    INNER JOIN brands b ON p.brandId = b.id
    INNER JOIN categories c ON p.categoryId = c.id
    ${whereClause}
    ORDER BY p.id ASC
    `,
      { type: QueryTypes.SELECT },
    );

    return products;
  }

  async getById(id, { includeDeleted = false } = {}) {
    const conditions = ["p.id = :id"];
    const replacements = { id };

    if (!includeDeleted) {
      conditions.push("p.isDeleted = 0");
    }

    const [product] = await this.sequelize.query(
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
      p.updatedAt,
      p.brandId,
      p.categoryId,
      b.name AS brand,
      c.name AS category
    FROM products p
    INNER JOIN brands b ON p.brandId = b.id
    INNER JOIN categories c ON p.categoryId = c.id
    WHERE ${conditions.join(" AND ")}
    `,
      { replacements, type: QueryTypes.SELECT },
    );

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
    const exists = await this.Product.findByPk(id);
    if (!exists) throw new AppError(404, "Product not found");

    await this.Product.update(updates, { where: { id } });
    return this.getById(id, { includeDeleted: true });
  }

  async softDelete(id) {
    const product = await this.Product.findByPk(id);
    if (!product) throw new AppError(404, "Product not found");
    await product.update({ isDeleted: true });
  }

  async lockAndValidateStock(productId, requestedQuantity, transaction) {
    const product = await this.Product.findByPk(productId, { transaction, lock: transaction.LOCK.UPDATE });

    if (!product) throw new AppError(404, "Product not found");
    if (product.isDeleted) throw new AppError(400, "Product no longer available");
    if (product.quantity < requestedQuantity) {
      throw new AppError(400, `Insufficient stock. Available: ${product.quantity}`);
    }
    return product;
  }

  async decrementStock(productUpdates, transaction) {
    for (const { id, quantity } of productUpdates) {
      await this.Product.decrement("quantity", {
        by: quantity,
        where: { id },
        transaction,
      });
    }
  }

  async search({ name, brand, category }, { includeDeleted = false } = {}) {
    const conditions = [];
    const replacements = {};

    if (!includeDeleted) {
      conditions.push("p.isDeleted = 0");
    }

    if (name) {
      conditions.push("p.name LIKE :name");
      replacements.name = `%${name}%`;
    }

    if (brand) {
      conditions.push("b.name LIKE :brand");
      replacements.brand = `%${brand}%`;
    }

    if (category) {
      conditions.push("c.name LIKE :category");
      replacements.category = `%${category}%`;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
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
      p.updatedAt,
      p.brandId,
      p.categoryId,
      b.name AS brand,
      c.name AS category
    FROM products p
    INNER JOIN brands b ON p.brandId = b.id
    INNER JOIN categories c ON p.categoryId = c.id
    ${whereClause}
    `,
      { replacements, type: QueryTypes.SELECT },
    );

    return products;
  }
  //add pagination if time
}

module.exports = ProductService;
