// Facade / orchestrator service for checkout transaction.
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
    //transaction
    //lock rows
    const transaction = await this.sequelize.transaction();

    try {
      //validate and get cart - cartservice
      const cart = await this.cartService.getCartWithItems(userId);
      //build Order - orderservice
      //check stock quantity - productservice
      //check membership - user/membershipservice
      const user = await this.userService.getById(userId, transaction);
      const membership = await this.membershipService.getById(user.membershipId, transaction);
      //change orderstatus - orderstatusservice
      // create order and order items, with discoint and membershipsnapshot.
      //handle stock /decrement - productservice
      //calculate and update user membership if needed - membershipservice/userservice.
      const newMembership = await this.membershipService.determineMembershipTier(
        user.totalPurchasedQuantity,
        transaction,
      );
      await this.userService.updateUserMembership(userId, newMembership, transaction);
      // Clear cart - cartservice
      await this.cartService.clearCart(cartId, transaction);
      //get and return order details - orderservice

      await transaction.commit();
      return order;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}

module.exports = CheckoutService;
