class CheckoutService {
  constructor(db, { cartService, orderService, productService, userService, membershipService, orderStatusService }) {
    this.sequelize = db.sequelize;
    this.cartService = cartService;
    this.orderService = orderService;
    this.productService = productService;
    this.userService = userService;
    this.membershipService = membershipService;
    this.orderStatusService = orderStatusService;
  }

  async checkout(userId) {
    const transaction = await this.sequelize.transaction();

    try {
      const { cartId, items: cartItems } = await this.cartService.getCartItemsForCheckout(userId, transaction);
      const orderItems = [];

      for (const item of cartItems) {
        const lockedProduct = await this.productService.lockAndValidateStock(
          item.productId,
          item.quantity,
          transaction,
        );

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPriceAtPurchase: lockedProduct.unitPrice,
          productNameAtPurchase: lockedProduct.name,
        });
      }

      const user = await this.userService.getById(userId, transaction);
      const membership = await this.membershipService.getById(user.membershipId, transaction);
      const inProgressStatus = await this.orderStatusService.getByName("In Progress", transaction);

      const orderData = {
        userId: user.id,
        discountPercentAtPurchase: membership.discountPercent,
        membershipNameAtPurchase: membership.name,
        orderStatusId: inProgressStatus.id,
      };
      const order = await this.orderService.create(orderData, orderItems, transaction);

      await this.productService.decrementStock(
        cartItems.map((item) => ({ id: item.productId, quantity: item.quantity })),
        transaction,
      );

      const purchasedQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const updatedUser = await this.userService.incrementTotalPurchasedQuantity(
        userId,
        purchasedQuantity,
        transaction,
      );

      const newMembership = await this.membershipService.determineMembershipTier(
        updatedUser.totalPurchasedQuantity,
        transaction,
      );
      if (newMembership.id !== updatedUser.membershipId) {
        await this.userService.updateUserMembership(userId, newMembership.id, transaction);
      }

      await this.cartService.clearCart(cartId, transaction);
      const orderWithDetails = await this.orderService.getByIdForUser(order.id, userId, transaction);
      await transaction.commit();
      return orderWithDetails;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = CheckoutService;
