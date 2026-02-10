const { AppError } = require("../utils/AppError");

class CartService {
  constructor(db) {
    this.sequelize = db.sequelize;
    this.Cart = db.Cart;
    this.CartItem = db.CartItem;
    this.Product = db.Product;
  }
  get #cartInclude() {
    return [
      {
        model: this.CartItem,
        as: "items",
        include: [
          {
            model: this.Product,
            as: "product",
            attributes: ["id", "name", "unitPrice", "quantity", "imgUrl", "isDeleted"],
          },
        ],
      },
    ];
  }

  async getCartWithItems(userId) {
    const cart = await this.Cart.findOne({
      where: { userId },
      include: this.#cartInclude,
    });
    return cart || { userId, items: [] };
  }

  async addItem(userId, productId, quantity = 1) {
    const transaction = await this.sequelize.transaction();

    try {
      const [cart] = await this.Cart.findOrCreate({
        where: { userId },
        defaults: { userId },
        transaction,
      });

      const product = await this.Product.findByPk(productId, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!product) throw new AppError(404, "Product not found");
      if (product.isDeleted) throw new AppError(400, "Product is no longer available");
      if (quantity > product.quantity) {
        throw new AppError(400, `Insufficient stock. Available: ${product.quantity}`);
      }

      const [cartItem, wasCreated] = await this.CartItem.findOrCreate({
        where: { cartId: cart.id, productId },
        defaults: { cartId: cart.id, productId, quantity },
        transaction,
      });

      if (!wasCreated) {
        const newQuantity = cartItem.quantity + quantity;
        if (newQuantity > product.quantity) {
          throw new AppError(400, `Insufficient stock. Available: ${product.quantity}`);
        }
        await cartItem.update({ quantity: newQuantity }, { transaction });
      }

      const updatedCart = await this.Cart.findByPk(cart.id, {
        include: this.#cartInclude,
        transaction,
      });

      await transaction.commit();
      return updatedCart;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async updateItemQuantity(userId, productId, quantity) {
    const transaction = await this.sequelize.transaction();

    try {
      const cart = await this.Cart.findOne({
        where: { userId },
        transaction,
      });
      if (!cart) throw new AppError(404, "Cart not found");

      const cartItem = await this.CartItem.findOne({
        where: { cartId: cart.id, productId },
        transaction,
      });
      if (!cartItem) throw new AppError(404, "Item not in cart");

      const product = await this.Product.findByPk(productId, {
        lock: transaction.LOCK.UPDATE,
        transaction,
      });
      if (!product) throw new AppError(404, "Product not found");
      if (product.isDeleted && quantity > cartItem.quantity) {
        throw new AppError(400, "Product is no longer available");
      }
      if (!product.isDeleted && quantity > product.quantity) {
        throw new AppError(400, `Insufficient stock. Available: ${product.quantity}`);
      }

      await cartItem.update({ quantity }, { transaction });

      const updatedCart = await this.Cart.findByPk(cart.id, {
        include: this.#cartInclude,
        transaction,
      });

      await transaction.commit();
      return updatedCart;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async removeItem(userId, productId) {
    const transaction = await this.sequelize.transaction();

    try {
      const cart = await this.Cart.findOne({
        where: { userId },
        transaction,
      });
      if (!cart) throw new AppError(404, "Cart not found");

      const deletedCount = await this.CartItem.destroy({
        where: { cartId: cart.id, productId },
        transaction,
      });
      if (deletedCount === 0) throw new AppError(404, "Item not in cart");

      const updatedCart = await this.Cart.findByPk(cart.id, {
        include: this.#cartInclude,
        transaction,
      });

      await transaction.commit();
      return updatedCart;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async clearCart(cartId, transaction) {
    await this.CartItem.destroy({
      where: { cartId },
      transaction,
    });
  }

  async getCartItemsForCheckout(userId, transaction) {
    const cart = await this.Cart.findOne({
      where: { userId },
      transaction,
    });
    if (!cart) throw new AppError(404, "Cart not found");

    const items = await this.CartItem.findAll({
      where: { cartId: cart.id },
      transaction,
    });

    if (items.length === 0) {
      throw new AppError(400, "Cart is empty");
    }
    return { cartId: cart.id, items };
  }
}

module.exports = CartService;
