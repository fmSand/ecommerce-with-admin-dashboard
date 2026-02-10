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
    const transaction = await this.sequelize.transaction();

    try {
      //validate and get cart - cartservice
      const { cartId, items: cartItems } = await this.cartService.getCartItemsForCheckout(userId, transaction); //cartitems=array from findAll()

      const orderItems = [];
      //check stock quantity - productservice
      // for (const item of cartItems) { run checkstock? --> then push to orderItems if still available.
      const stock = await this.productService.checkStock(productId, quantity, transaction); //this items productid and quantety

      // cartitems --> push in (productids, quantites, unitPriceAtPurchase, productNameAtPurchase)--> orderitems

      //check membership - user/membershipservice
      const user = await this.userService.getById(userId, transaction);
      const membership = await this.membershipService.getById(user.membershipId, transaction);
      //change orderstatus - orderstatusservice
      const status = await this.orderStatusService.getByName("In Progress", transaction);

      // create order:
      // order {}--> data: userid,membershipNameAtPurchase, discountPercentAtPurchase, orderStatusId (totalamount etc if adding later) + items/products
      const order = await this.orderService.create(orderData, orderItems, transaction);

      //handle stock /decrement (before or after clearing cart?)- productservice

      //calculate and update user membership if needed - membershipservice/userservice.
      const quantityToAdd = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const updatedUser = await this.userService.updateTotalPurchasedQuantity(userId, quantityToAdd, transaction);
      const newMembership = await this.membershipService.determineMembershipTier(
        updatedUser.totalPurchasedQuantity,
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

/**
 * If time:
 * total price for order etc (need model changes). Before cost, discount takes away this amount = final price.
 * currency?
 */

module.exports = CheckoutService;
