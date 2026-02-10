const { AppError } = require("../utils/AppError");

class BrandService {
  constructor(db) {
    this.Brand = db.Brand;
    this.Product = db.Product;
  }

  async getById(id) {
    const brand = await this.Brand.findByPk(id);
    if (!brand) throw new AppError(404, "Brand not found");
    return brand;
  }

  async getAll() {
    return this.Brand.findAll({ order: [["name", "ASC"]] });
  }

  async create(name) {
    return this.Brand.create({ name });
  }

  async update(id, name) {
    const brand = await this.Brand.findByPk(id);
    if (!brand) throw new AppError(404, "Brand not found");
    await brand.update({ name });
    return brand;
  }

  async delete(id) {
    const brand = await this.Brand.findByPk(id);
    if (!brand) throw new AppError(404, "Brand not found");

    const productCount = await this.Product.count({ where: { brandId: id } });
    if (productCount > 0) {
      throw new AppError(400, "Cannot delete brand with existing products");
    }

    await brand.destroy();
  }
}

module.exports = BrandService;
