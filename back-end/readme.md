# EP E-Commerce - Back-End API

REST API for EP e-commerce platform. Handles authentication, users, products, brands, categories, cart, orders, memberships, and related CRUD operations. The admin front-end (EPAdmin) consumes this API exclusively.

## Tech Stack

- **Runtime:** Node.js (v22.14.0)
- **Framework:** Express
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JWT (`jsonwebtoken`), `bcrypt`
- **Validation:** Joi
- **Documentation:** `swagger-jsdoc` + `swagger-ui-express`
- **Testing:** Jest + Supertest
- **Security:** Helmet

## Prerequisites

- Node.js v18.x or higher (developed and tested with v22.14.0)
- MySQL 8.x running locally or remotely
- An empty MySQL database created before first run

## Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/fmSand/ecommerce-with-admin-dashboard
   ```

2. **Navigate to the back-end directory**

   ```bash
   cd back-end
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `back-end/` root directory, or copy the example file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   See the [Environment Variables](#environment-variables) section below.

5. **Create the MySQL database**

   ```sql
   CREATE DATABASE noroff_ep_ecommerce;
   ```

   Or use whatever name you configure in `DATABASE_NAME` in your `.env` file.

6. **Start the server**

   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

   The database schema is created automatically via `sequelize.sync()` on startup.

7. **Initialize the database**

   Send a `POST` request to seed the database with roles, memberships, the admin user, order statuses, and products from the Noroff API:

   ```
   POST http://localhost:3000/init
   ```

   This endpoint is idempotent. If the database is already populated it returns `200`. On first run it returns `201`.

   The `/init` endpoint creates:
   - Two roles (`Admin`, `User`)
   - Three membership tiers (`Bronze` 0%, `Silver` 15%, `Gold` 30%)
   - One admin user (username: `Admin`, password: `P@ssword2023`)
   - Three order statuses (`In Progress`, `Ordered`, `Completed`)
   - All products, brands, and categories from the Noroff API

8. **Access the API**
   - API Base URL: `http://localhost:3000`
   - Swagger Documentation: `http://localhost:3000/doc`

## Available Scripts

| Script  | Command       | Description                                          |
| ------- | ------------- | ---------------------------------------------------- |
| `start` | `npm start`   | Start the production server                          |
| `dev`   | `npm run dev` | Start development server with `--watch` auto-restart |
| `test`  | `npm test`    | Run the Jest test suite                              |

## Environment Variables

Create a `.env` file in the `back-end/` root directory:

```env
# App
NODE_ENV=development
PORT=3000

# Database
DIALECT=mysql
HOST=localhost
DATABASE_NAME=noroff_ep_ecommerce
ADMIN_USERNAME=your_mysql_username
ADMIN_PASSWORD=your_mysql_password

# Auth
JWT_SECRET=your-secret-jwt-key
JWT_EXPIRES_IN=2h

# Noroff API (used by /init endpoint)
NOROFF_PRODUCTS_URL="http://backend.restapi.co.za/items/products"
```

Replace `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `JWT_SECRET` with your own values.

## API Endpoints

All endpoints return a standardized JSON response envelope (see [Response Format](#response-format)).

| Base Path         | Description                                              | Auth                                                      |
| ----------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| `/init`           | Database initialization                                  | None                                                      |
| `/auth`           | Registration and login                                   | None                                                      |
| `/products`       | Product CRUD (soft delete)                               | Read: public, Write: admin                                |
| `/brands`         | Brand CRUD                                               | Read: public, Write: admin                                |
| `/categories`     | Category CRUD                                            | Read: public, Write: admin                                |
| `/cart`           | Cart management and checkout                             | Registered user                                           |
| `/orders`         | Order viewing, status updates                            | User: own orders (read-only), Admin: all + status updates |
| `/order-statuses` | Order status lookup                                      | Admin                                                     |
| `/users`          | User viewing, profile editing, role assignment, deletion | View/edit profile: self or admin, Role/delete: admin      |
| `/memberships`    | Membership tier viewing/editing                          | Read: public, Write: admin                                |
| `/roles`          | Role lookup                                              | Admin                                                     |
| `/search`         | Product search (raw SQL)                                 | public                                                    |

For full endpoint details including request/response schemas, see the interactive Swagger documentation at `http://localhost:3000/doc`.

## Response Format

All endpoints use a standardized JSON envelope:

**Success:**

```json
{
  "status": "success",
  "statuscode": 200,
  "data": {
    "result": "Informative message of what has been done"
  }
}
```

**Error:**

```json
{
  "status": "error",
  "statuscode": 400,
  "data": {
    "result": "Description of what went wrong"
  }
}
```

Validation errors include a `details` array with per-field messages:

```json
{
  "status": "error",
  "statuscode": 400,
  "data": {
    "result": "Validation error",
    "details": [{ "field": "name", "message": "name is required" }]
  }
}
```

## Authentication

The API uses JWT-based authentication. Tokens expire after 2 hours and must be included in requests as:

```
Authorization: Bearer <token>
```

Route-level middleware controls access:

- `optionalAuth` - parses the token if present. Guest access is allowed, but authenticated users can receive role-aware responses.
- `authenticate` - requires a valid token.
- `requireAdmin` - restricts to admin role.
- `requireSelfOrAdmin` - allows users to access their own resources, or admin to access any.
- `validate` - runs Joi schema validation on `body`, `params`, `or query`.

## Testing

Integration tests use Jest and Supertest. Run with:

```bash
npm test
```

### Required CRUD Flow (Steps 1-8)

The test suite runs the 8 sequential operations specified in the assignment as a single test:

1. Add a category with the name `TEST_CATEGORY`
2. Add a brand with the name `TEST_BRAND`
3. Add a product with the name `TEST_PRODUCT` (brand: `TEST_BRAND`, category: `TEST_CATEGORY`, quantity: 10, price: 99.99)
4. Get the newly created `TEST_PRODUCT` with all information, including category and brand name
5. Change the category name `TEST_CATEGORY` to `TEST_CATEGORY2`
6. Change the brand name `TEST_BRAND` to `TEST_BRAND2`
7. Get the product `TEST_PRODUCT` with all information, confirming updated category and brand names
8. Delete the `TEST_PRODUCT` (soft delete, verified from both guest and admin perspectives)

### Additional Tests

Beyond the required flow, the suite includes authentication and error-handling tests such as:

- Protected endpoints reject requests with no token (`401`)
- Protected endpoints reject non-admin users (`403`)
- Missing required fields return `400` with validation error details
- Invalid foreign key IDs return `400` with an invalid reference error
- Malformed `Authorization` header returns `401`

Test data is cleaned up in `afterAll` using `Op.in` so records are removed regardless of rename state.

## Project Structure

```
back-end/
├── bin/                     # Server entry point
├── constants/               # Role IDs, seed data
├── controllers/             # Thin request handlers
├── middleware/
│   ├── asyncHandler.js      # try/catch wrapper
│   ├── auth.js              # JWT verification, role guards
│   ├── errorHandler.js      # Centralized error handling
│   ├── validate.js          # Joi validation middleware
│   └── index.js             # Barrel export
├── models/                  # Sequelize model definitions
├── routes/                  # Express routers
├── services/                # Domain service classes + CheckoutService
│   └── index.js             # Barrel export and service wiring
├── tests/                   # Jest + Supertest integration tests
├── utils/                   # AppError, response helpers, JWT, order number generation
├── validation/              # Joi schemas
├── .env.example
├── .gitignore
├── app.js                   # Express app configuration
├── swagger.js               # Swagger/OpenAPI setup
└── package.json
```

## Architecture Notes

- **Thin controllers, service-layer logic.** Controllers handle HTTP concerns only: reading request data, calling the relevant service, and returning the response. Business logic and database interaction live in the service layer.
- **Centralized error handling.** A custom `AppError` class and global `errorHandler` middleware convert known errors, including Sequelize constraint errors, into consistent HTTP responses.
- **Checkout as a transaction.** `CheckoutService` orchestrates cart validation, stock locking (`SELECT ... FOR UPDATE`), price snapshotting, order creation, stock decrement, membership tier evaluation, and cart clearing within a single database transaction.
- **\*Price and order snapshotting at checkout.** `unitPriceAtPurchase` and `productNameAtPurchase` on `OrderItem` preserve historical product data. `discountPercentAtPurchase`, `membershipNameAtPurchase`, and `totalAmount` on `Order` preserve membership state and computed totals at purchase time.
  `totalAmount` is calculated once using integer-cents arithmetic and stored as a deliberate denormalization.
- **Soft deletes.** Products use a manual `isDeleted` boolean. Admins can see all products, while public users only see active products.
- **Raw SQL for product queries.** Product listing and search endpoints use raw SQL queries.

## Dependencies

### Production

| Package              | Version | Purpose                                     |
| -------------------- | ------- | ------------------------------------------- |
| `bcrypt`             | ^6.0.0  | Password hashing                            |
| `cookie-parser`      | ~1.4.4  | Cookie parsing middleware                   |
| `debug`              | ~2.6.9  | Debug logging utility                       |
| `dotenv`             | ^17.2.4 | Environment variable management             |
| `express`            | ^4.22.1 | Web application framework                   |
| `helmet`             | ^8.1.0  | Security headers                            |
| `http-errors`        | ~1.6.3  | HTTP error creation utility                 |
| `joi`                | ^18.0.2 | Request validation schemas                  |
| `morgan`             | ^1.10.1 | HTTP request logger                         |
| `jsonwebtoken`       | ^9.0.3  | JWT creation and verification               |
| `mysql2`             | ^3.16.3 | MySQL client for Node.js used by Sequelize  |
| `sequelize`          | ^6.37.7 | ORM for MySQL                               |
| `swagger-jsdoc`      | ^6.2.8  | OpenAPI spec generation from JSDoc comments |
| `swagger-ui-express` | ^5.0.1  | Swagger UI served at `/doc`                 |

### Development

| Package     | Version | Purpose                                      |
| ----------- | ------- | -------------------------------------------- |
| `jest`      | ^30.2.0 | Testing framework                            |
| `supertest` | ^7.2.2  | HTTP assertion library for integration tests |

## Node.js Version

This project was developed and tested with **Node.js v22.14.0**. Node.js v18.x or higher is recommended.
