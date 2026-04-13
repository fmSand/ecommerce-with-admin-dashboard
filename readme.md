<a id="readme-top"></a>

# EP E-Commerce

Full-stack e-commerce application built as Noroff back-end assignment. The system consists of two separate Express applications: a REST API (back-end) and a server-rendered admin panel (front-end). The back-end provides all data access through API endpoints, and the front-end consumes those endpoints exclusively.

<details>
<summary><strong>Table of Contents</strong></summary>

- [Noroff EP E-Commerce](#noroff-ep-e-commerce)
  - [Repository Structure](#repository-structure)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [1. Back-End](#1-back-end)
    - [2. Front-End](#2-front-end)
  - [Architecture](#architecture)
  - [Tech Stack](#tech-stack)
      - [Back-End](#back-end)
      - [Front-End](#front-end)
  - [API Documentation](#api-documentation)
  - [Testing](#testing)
  - [Node.js Version](#nodejs-version)
  - [REFERENCES](#references)
    - [Architecture and Patterns](#architecture-and-patterns)
    - [Error Handling](#error-handling)
    - [Authentication and Security](#authentication-and-security)
    - [Checkout and Financial Calculations](#checkout-and-financial-calculations)
    - [Previous Work](#previous-work)

</details>

## Repository Structure

```
├── back-end/                # REST API (Express, Sequelize, MySQL)
├── front-end/               # Admin panel (Express, EJS, Bootstrap)
├── Documentation/           # Reflection report (PDF)
└── readme.md                # This file
```

Each application has its own `package.json`, dependencies, and README with detailed setup instructions:

- [Back-End README](./back-end/readme.md) - API endpoints, environment variables, testing, architecture
- [Front-End README](./front-end/readme.md) - Admin panel features, API communication, design

## Quick Start

### Prerequisites

- Node.js v18.x or higher (developed and tested with v22.14.0)
- MySQL 8.x


**Clone the repository:**
 ```bash
 git clone <repository-url>
 cd <repository-directory>
 ```

### 1. Back-End

```bash
cd back-end
npm install
cp .env.example .env        # Fill in your database credentials and JWT secret
npm start                   # Runs on http://localhost:3000
```

Then initialize the database by sending `POST http://localhost:3000/init`. This seeds roles, memberships, the admin user, order statuses, and all products from the Noroff API.

### 2. Front-End

```bash
cd front-end
npm install
cp .env.example .env        # Fill in your session secret
npm start                   # Runs on http://localhost:3001
```

Log in at `http://localhost:3001` with the admin credentials created by `/init`

Username: `Admin`<br>
Password: `P@ssword2023`

## Architecture

The two applications run on separate ports and communicate over HTTP:

```
Browser --> Front-End (:3001) --> Back-End API (:3000) --> MySQL
              EJS views              JSON responses
              Session (JWT)          JWT auth
```

The front-end never accesses the database directly. All data flows through the back-end API. The front-end stores the JWT token in a server-side session and attaches it as a Bearer header when proxying requests to the API.

## Tech Stack

|                | Back-End                           | Front-End                  |
| -------------- | ---------------------------------- | -------------------------- |
| **Runtime**    | Node.js v22.14.0                   | Node.js v22.14.0           |
| **Framework**  | Express                            | Express                    |
| **Database**   | MySQL + Sequelize                  | -                          |
| **Auth**       | JWT + bcrypt                       | express-session            |
| **Validation** | Joi                                | -                          |
| **Templating** | -                                  | EJS                        |
| **CSS**        | -                                  | Bootstrap 5.3 + custom CSS |
| **Docs**       | swagger-jsdoc + swagger-ui-express | -                          |
| **Testing**    | Jest + Supertest                   | -                          |
| **Security**   | Helmet                             | Helmet                     |

<details>
<summary><strong>Dependency Versions</strong></summary>

#### Back-End

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
| `jest`               | ^30.2.0 | Testing framework (dev)                     |
| `supertest`          | ^7.2.2  | HTTP assertion library (dev)                |

#### Front-End

| Package           | Version | Purpose                         |
| ----------------- | ------- | ------------------------------- |
| `bootstrap`       | ^5.3.8  | CSS framework                   |
| `bootstrap-icons` | ^1.13.1 | Icon library                    |
| `cookie-parser`   | ~1.4.4  | Cookie parsing middleware       |
| `debug`           | ~2.6.9  | Debug logging utility           |
| `dotenv`          | ^17.3.1 | Environment variable management |
| `ejs`             | ^4.0.1  | EJS templating engine           |
| `express`         | ^4.22.1 | Web application framework       |
| `express-session` | ^1.17.3 | Server-side session management  |
| `helmet`          | ^8.1.0  | Security headers                |
| `http-errors`     | ~1.6.3  | HTTP error creation utility     |
| `morgan`          | ^1.10.1 | HTTP request logger             |

</details>

## API Documentation

Swagger documentation is available at `http://localhost:3000/doc` when the back-end is running.

## Testing

Integration tests cover the 8 required CRUD operations plus additional error handling and authentication tests. See the [Back-End README](./back-end/readme.md#testing) for details.

```bash
cd back-end
npm test
```

## Node.js Version

This project was developed and tested with **Node.js v22.14.0**. Node.js v18.x or higher is recommended.

---

## REFERENCES

### Architecture and Patterns

- ["Session Facade"](https://java-design-patterns.com/patterns/session-facade/#example-scenario)
  The pattern of a single service providing a unified interface to coordinate multiple lower-level services. Influenced the design of `CheckoutService` (`back-end/services/CheckoutService.js`) as a facade coordinating six other services (cart, order, product, user, membership, order status) within a single transaction.

- [Corey Cleary- "Why you should isolate Express from the rest of your Node application"](https://www.coreycleary.me/why-you-should-isolate-express-from-the-rest-of-your-node-application)
  The argument for not leaking `req`/`res` into service layers. Services in this project receive plain values and return plain objects; they have no awareness of Express.

- [NestJS - Authentication documentation](https://docs.nestjs.com/security/authentication) (pattern reference, not the library itself)
  The pattern of having a dedicated AuthService that orchestrates credential validation by calling UserService, keeping token logic out of the user data layer. Influenced the separation between `AuthService` and `UserService` in `back-end/services/`.

- [Wikipedia - Post/Redirect/Get pattern](https://en.wikipedia.org/wiki/Post/Redirect/Get)
  Used in the front-end for all form submissions (e.g., product create/edit, user profile edit, role update). After a successful POST, the route handler redirects with a flash message to avoid duplicate submissions on refresh.

- [Node.js Design Patterns- "Node.js HTTP Requests"](https://nodejsdesignpatterns.com/blog/nodejs-http-request/)
  Reference for fetch patterns including `AbortSignal.timeout()`. Used in the back-end `/init` route (10s timeout on Noroff API call) and the front-end `apiClient` (10s timeout on all API requests to the back-end).

- [jaredhanson/connect-flash](https://github.com/jaredhanson/connect-flash)
  Pattern reference for session-based flash messages. The project implements its own lightweight version (setting `req.session.flash` and clearing it in a global middleware in `front-end/app.js`) rather than using the library directly.

### Error Handling

- [Express.js - Error handling guide](https://expressjs.com/en/guide/error-handling.html)
  Foundation for the centralized error handler in `back-end/middleware/errorHandler.js`.

- [Better Stack- "Error Handling in Express"](https://betterstack.com/community/guides/scaling-nodejs/error-handling-express/#using-custom-error-classes)
  Informed the `AppError` custom error class (`back-end/utils/AppError.js`) that carries a `statusCode` and optional `extraData`, allowing the error handler to produce structured JSON responses.

- [Juniors-Dev Backend-Productivity-Graveyard - `asyncHandler.js`](https://github.com/Juniors-Dev/Backend-Productivity-Graveyard/blob/dev/middleware/asyncHandler.js)
  From a team hobby project I contributed to. The `asyncHandler` wrapper was carried over as-is to `back-end/middleware/asyncHandler.js`. Wraps async route handlers in try/catch so thrown errors reach the centralized error handler. Note: [not needed in Express 5](https://expressjs.com/en/guide/migrating-5.html#rejected-promises), which handles rejected promises natively. The [`response.js`](https://github.com/Juniors-Dev/Backend-Productivity-Graveyard/blob/dev/utilities/response.js) helper pattern also originated here - adapted for this project to call `res.status().json()` directly rather than returning plain objects, and reshaped to match the assignment's required JSON envelope format.

### Authentication and Security

- [auth0/express-jwt](https://github.com/auth0/express-jwt)
  Pattern reference for the `optionalAuth` middleware in `back-end/middleware/auth.js`. The idea of a middleware that parses a token if present but allows unauthenticated requests through (used on `GET /products` so admins see soft-deleted products while guests see only active ones).

- [Express.js - Security best practices (session cookie naming)](https://expressjs.com/en/advanced/best-practice-security.html#dont-use-the-default-session-cookie-name)
  The front-end uses a custom session cookie name (`admin.sid`) instead of the default `connect.sid` to avoid fingerprinting the framework. Applied in `front-end/app.js` session configuration.

- [MDN - Set-Cookie `SameSite` attribute](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie#samesitesamesite-value)
  Reference for understanding `sameSite: "lax"` on the session cookie in the front-end. Ensures the cookie is sent on top-level navigations but not on cross-site subrequests.

- [Artem Khrenov- "The Complete Guide to Joi Validation in Production Node.js Applications"](https://medium.com/@artemkhrenov/the-complete-guide-to-joi-validation-in-production-node-js-applications-96acaddae056)
  Informed the reusable `validate` middleware in `back-end/middleware/validate.js`. The pattern of `schema.validate(req[property], { abortEarly: false, stripUnknown: true })` and mapping Joi error details to a structured response came from this article.

### Checkout and Financial Calculations

- [HackerOne- "Precision Matters: Why Using Cents Instead of Floating Point for Transaction Amounts is Crucial"](https://www.hackerone.com/blog/precision-matters-why-using-cents-instead-floating-point-transaction-amounts-crucial)
  Why `CheckoutService` (`back-end/services/CheckoutService.js`) converts prices to integer cents before calculating subtotals and discounts, then converts back to decimal for storage. Avoids floating-point rounding errors in monetary calculations.

- [Shopify - Order REST API resource](https://shopify.dev/docs/api/admin-rest/latest/resources/order)
  Referenced as an industry example of how e-commerce platforms store `total_price` directly on the order object as a first-class field, not derived on read. Informed the decision to add `totalAmount` to the Order model.

- [Stack Overflow- "Should total price of order be stored in the database?"](https://stackoverflow.com/questions/64654855/got-orders-and-order-products-tables-should-total-price-of-order-be-stored-in-th)
  Discussion of whether to store derived totals on orders vs computing from line items. Read during a period of indecision about `totalAmount`.

- [Stack Overflow- "How to generate a unique 8 digit number using crypto in Node.js"](https://stackoverflow.com/questions/76028046/how-to-generate-a-unique-8-digit-number-using-crypto-in-node-js)
  Informed the order number generator in `back-end/utils/orderNumber.js`. Uses `crypto.randomInt` for cryptographically secure random index selection into a base62 alphabet.

- [Boot.dev- "Node.js Random Number"](https://blog.boot.dev/cryptography/node-js-random-number/)
  Additional reference for `crypto.randomInt` usage and why it is preferred over `Math.random` for generating identifiers.
