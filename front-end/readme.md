# EP E-Commerce - Admin Front-End (EPAdmin)

Server-rendered admin panel for managing the Noroff EP e-commerce platform. This application consumes the back-end REST API exclusively and does not access the database directly.

## Tech Stack

- **Runtime:** Node.js (v22.14.0)
- **Framework:** Express
- **Templating:** EJS
- **CSS:** Bootstrap 5.3 + Bootstrap Icons + custom CSS
- **Session:** express-session (server-side, cookie-based)
- **Security:** Helmet
- **Client-Side:** Vanilla JavaScript (`fetch` for inline editing)

## Prerequisites

- Node.js v18.x or higher (developed and tested with v22.14.0)
- The back-end API running and initialized (see back-end README)

## Installation Steps

1. **Clone the repository** (if not already done)

   ```bash
   git clone https://github.com/fmSand/ecommerce-with-admin-dashboard
   ```

2. **Navigate to the front-end directory**

   ```bash
   cd front-end
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `front-end/` root directory, or copy the example file and fill in your values:

   ```bash
   cp .env.example .env
   ```

   See the [Environment Variables](#environment-variables) section below.

5. **Start the back-end API first**

   The admin panel depends on the back-end API being available. Make sure it is running and initialized before starting the front-end. See the back-end README forfor setup instructions.

6. **Start the front-end server**

   ```bash
      # Development mode (with auto-reload)
      npm run dev

      # Production mode
      npm start
   ```

7. **Access the admin panel**
   - Admin Panel: `http://localhost:3001`
   - Login with the admin credentials created by the back-end `/init` endpoint
     Username: `Admin` <br>
     Password: `P@ssword2023`

## Available Scripts

| Script  | Command       | Description                                          |
| ------- | ------------- | ---------------------------------------------------- |
| `start` | `npm start`   | Start the production server                          |
| `dev`   | `npm run dev` | Start development server with `--watch` auto-restart |

## Environment Variables

Create a `.env` file in the `front-end/` root directory:

```env
NODE_ENV=development
PORT=3001
API_URL=http://localhost:3000
SESSION_SECRET=your_session_secret_here
```

`API_URL` must point to the running back-end API. Replace `SESSION_SECRET` with your own value.

## Features

All data management is performed through the back-end API via a centralized `apiClient` utility (`utils/apiClient.js`).

- **Authentication:** Admin-only login. The session stores the JWT token received from the API. Non-admin users are rejected at login.
- **Dashboard:** Overview with key metrics and navigation.
- **Products:** Full CRUD with soft delete, search through the back-end `/search` endpoint, image display, and stock indicators.
- **Brands:** CRUD with inline editing.
- **Categories:** CRUD with inline editing.
- **Orders:** View all orders in a list. Order totals, discount percentage, and membership tier at purchase are displayed. Open each order page for more details. Admin can update order status.
- **Users:** View all users, view user detail, update roles.
- **Memberships:** View and edit discount percentages.

## API Communication

The `apiClient` (`utils/apiClient.js`) is a thin wrapper around `fetch` that:

- prepends `API_URL` to all request paths
- attaches the JWT token stored in the session as a `Bearer` header
- parses the standardized JSON response and throws on error status
- enforces a 10-second timeout via `AbortSignal`

Route handlers call `apiClient.get()`, `apiClient.post()`, and similar methods, then pass response data to EJS templates.

For inline editing (brands, categories, memberships), client-side JavaScript sends `fetch` requests to the front-end's own Express routes. Those routes then proxy the request to the back-end API through `apiClient`. The browser never communicates with the back-end API directly and never stores or attaches the JWT itself.

## Authentication and Sessions

Authentication is handled through the back-end API. After a successful admin login, the front-end stores the returned JWT in the server-side session and uses it for subsequent API requests.

Sessions are configured with a 2-hour lifetime, aligned with the JWT expiry used by the back-end. This keeps the admin panel and API authentication flow consistent.

## Project Structure

```
front-end/
├── bin/                     # Server entry point
├── middleware/
│   └── auth.js              # Session-based admin guard
├── public/
│   ├── js/                  # Client-side scripts (inline editing, search)
│   └── stylesheets/         # Custom theme and styles
├── routes/                  # Express route handlers
├── utils/                   # apiClient, constants, form helpers
├── views/
│   ├── brands/              # Brand management view
│   ├── categories/          # Category management view
│   ├── memberships/         # Membership management view
│   ├── orders/              # Order list and detail views
│   ├── partials/            # Shared layout partials
│   ├── products/            # Product list, new, and edit views
│   ├── users/               # User list and detail views
│   ├── dashboard.ejs
│   ├── error.ejs
│   └── login.ejs
├── .env.example
├── .gitignore
├── app.js                   # Express app configuration
└── package.json
```

## Dependencies

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

## Node.js Version

This project was developed and tested with **Node.js v22.14.0**. Node.js v18.x or higher is recommended.
