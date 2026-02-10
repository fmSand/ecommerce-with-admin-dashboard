const { AppError } = require("../utils/AppError");

class CategoryService {
  constructor(db) {
    this.Category = db.Category;
    this.Product = db.Product;
  }

  async getById(id) {
    const category = await this.Category.findByPk(id);
    if (!category) throw new AppError(404, "Category not found");
    return category;
  }

  async getAll() {
    return this.Category.findAll({ order: [["name", "ASC"]] });
  }

  async create(name) {
    return this.Category.create({ name });
  }

  async update(id, name) {
    const category = await this.Category.findByPk(id);
    if (!category) throw new AppError(404, "Category not found");
    await category.update({ name });
    return category;
  }

  async delete(id) {
    const category = await this.Category.findByPk(id);
    if (!category) throw new AppError(404, "Category not found");

    const productCount = await this.Product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      throw new AppError(400, "Cannot delete category with existing products");
    }

    await category.destroy();
  }
}

module.exports = CategoryService;
