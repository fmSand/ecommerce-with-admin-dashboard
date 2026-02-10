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

  async checkout(user) {
    //transaction
    //lock rows
    const transaction = await this.sequelize.transaction();

    try {
      //validate and get cart - cartservice
      //build Order - orderservice
      //check stock quantity - productservice
      //check membership - user/membershipservice
      //change orderstatus - orderstatusservice
      // create order and order items, with discoint and membershipsnapshot.
      //handle stock /decrement - productservice
      //calculate and update user membership if needed - membershipservice/userservice.
      // Clear cart - cartservice
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
