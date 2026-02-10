// orchestrator service for checkout transaction.
class CheckoutService {
  constructor(db) {
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
      //validate and get cart - cartservice
      const { cartId, items: cartItems } = await this.cartService.getCartItemsForCheckout(userId, transaction);

      const orderItems = [];
      //check stock quantity - productservice
      // for (const item of cartItems) { run checkstock? --> then push to orderItems if still available.
      for (const item of cartItems) {
        const lockedProduct = await this.productService.lockAndValidateStock(
          item.productId,
          item.quantity,
          transaction,
        );
        // cartitems --> push in (productids, quantites, unitPriceAtPurchase, productNameAtPurchase)--> orderitems
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPriceAtPurchase: lockedProduct.unitPrice,
          productNameAtPurchase: lockedProduct.name,
        });
      }

      //check membership - user/membershipservice
      const user = await this.userService.getById(userId, transaction);
      const membership = await this.membershipService.getById(user.membershipId, transaction);
      //change orderstatus - orderstatusservice
      const inProgressStatus = await this.orderStatusService.getByName("In Progress", transaction);

      // create order:
      // order {}--> data: userid,membershipNameAtPurchase, discountPercentAtPurchase, orderStatusId (totalamount etc if adding later) + items/products
      const orderData = {
        userId: user.id,
        discountPercentAtPurchase: membership.discountPercent,
        membershipNameAtPurchase: membership.name,
        orderStatusId: inProgressStatus.id,
      };

      const order = await this.orderService.create(orderData, orderItems, transaction);

      //handle stock /decrement (before or after clearing cart?)- productservice
      await this.productService.decrementStock(
        cartItems.map((item) => ({ id: item.productId, quantity: item.quantity })),
        transaction,
      );

      //calculate and update user membership if needed - membershipservice/userservice.
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
      // Clear cart - cartservice
      await this.cartService.clearCart(cartId, transaction);
      //change stock here?
      //get and return order details - orderservice.getByIdForUser
      const orderWithDetails = await this.orderService.getByIdForUser(order.id, userId, transaction);

      await transaction.commit();
      return orderWithDetails;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

/**
 * If time:
 * total price for order etc (need model changes). Before cost, discount takes away this amount = final price.
 * currency?
 */

module.exports = CheckoutService;
