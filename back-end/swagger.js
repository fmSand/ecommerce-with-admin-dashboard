const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Noroff EP E-Commerce API",
      version: "1.0.0",
      description:
        "Backend API for e-commerce platform with JWT authentication, role-based access control, shopping cart, order management, and membership discount system.",
      contact: {
        name: "Admin Support",
        email: "admin@noroff.no",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      { name: "Init", description: "Database initialization" },
      { name: "Auth", description: "Authentication and registration" },
      { name: "Products", description: "Product management (CRUD)" },
      { name: "Search", description: "Product search (raw SQL)" },
      { name: "Brands", description: "Brand management" },
      { name: "Categories", description: "Category management" },
      { name: "Cart", description: "Shopping cart operations" },
      { name: "Orders", description: "Order management" },
      { name: "Users", description: "User management" },
      { name: "Memberships", description: "Membership tier management" },
      { name: "Roles", description: "Role lookup (admin only)" },
      { name: "Order Statuses", description: "Order status lookup (admin only)" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT token obtained from /auth/login or /auth/register. Expires in 2 hours.",
        },
      },
      schemas: {
        //Shared responses
        SuccessResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            statuscode: { type: "integer", example: 200 },
            data: {
              type: "object",
              properties: {
                result: { type: "string", example: "Operation successful" },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          description: "Generic error response",
          properties: {
            status: { type: "string", example: "error" },
            statuscode: { type: "integer", example: 400 },
            data: {
              type: "object",
              properties: {
                result: { type: "string", example: "Error message" },
              },
            },
          },
        },
        UnauthorizedResponse: {
          type: "object",
          description: "Authentication required or token invalid/expired",
          properties: {
            status: { type: "string", example: "error" },
            statuscode: { type: "integer", example: 401 },
            data: {
              type: "object",
              properties: {
                result: { type: "string", example: "Token not provided" },
              },
            },
          },
        },
        ForbiddenResponse: {
          type: "object",
          description: "Insufficient permissions for this action",
          properties: {
            status: { type: "string", example: "error" },
            statuscode: { type: "integer", example: 403 },
            data: {
              type: "object",
              properties: {
                result: { type: "string", example: "Admin access required" },
              },
            },
          },
        },
        NotFoundResponse: {
          type: "object",
          description: "Requested resource does not exist",
          properties: {
            status: { type: "string", example: "error" },
            statuscode: { type: "integer", example: 404 },
            data: {
              type: "object",
              properties: {
                result: { type: "string", example: "Resource not found" },
              },
            },
          },
        },
        ConflictResponse: {
          type: "object",
          description: "Duplicate value violates unique constraint",
          properties: {
            status: { type: "string", example: "error" },
            statuscode: { type: "integer", example: 409 },
            data: {
              type: "object",
              properties: {
                result: { type: "string", example: "Name already exists" },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: { type: "string", example: "name" },
                      message: { type: "string", example: "name must be unique" },
                    },
                  },
                },
              },
            },
          },
        },
        InternalErrorResponse: {
          type: "object",
          description: "Unexpected server error",
          properties: {
            status: { type: "string", example: "error" },
            statuscode: { type: "integer", example: 500 },
            data: {
              type: "object",
              properties: {
                result: { type: "string", example: "Internal server error" },
              },
            },
          },
        },
        ValidationError: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            statuscode: { type: "integer", example: 400 },
            data: {
              type: "object",
              properties: {
                result: { type: "string", example: "Validation error" },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: { type: "string", example: "email" },
                      message: { type: "string", example: "email must be a valid email" },
                    },
                  },
                },
              },
            },
          },
        },
        //Auth
        RegisterRequest: {
          type: "object",
          required: ["username", "email", "password", "firstName", "lastName", "address", "city", "phone"],
          properties: {
            firstName: { type: "string", minLength: 2, maxLength: 100, example: "Bob" },
            lastName: { type: "string", minLength: 2, maxLength: 100, example: "Bobby" },
            username: {
              type: "string",
              minLength: 3,
              maxLength: 50,
              description: "No whitespace allowed",
              example: "bobbybob",
            },
            email: { type: "string", format: "email", example: "bobby@example.com" },
            password: { type: "string", minLength: 8, maxLength: 128, example: "SecurePass123!" },
            address: { type: "string", minLength: 1, maxLength: 255, example: "123 Bobs gate" },
            city: { type: "string", minLength: 2, maxLength: 100, example: "Oslo" },
            phone: { type: "string", pattern: "^\\d+$", minLength: 3, maxLength: 32, example: "12345678" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["identifier", "password"],
          properties: {
            identifier: {
              type: "string",
              minLength: 3,
              maxLength: 255,
              description: "Username or email address",
              example: "bobbybob",
            },
            password: { type: "string", minLength: 1, maxLength: 128, example: "SecurePass123!" },
          },
        },
        RegisterResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            statuscode: { type: "integer", example: 201 },
            data: {
              type: "object",
              properties: {
                result: { type: "string", example: "User registered successfully" },
                id: { type: "integer", example: 2 },
                email: { type: "string", example: "bobby@example.com" },
                name: { type: "string", example: "Bob Bobby" },
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
              },
            },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            statuscode: { type: "integer", example: 200 },
            data: {
              type: "object",
              properties: {
                result: { type: "string", example: "Login successful" },
                id: { type: "integer", example: 1 },
                email: { type: "string", example: "admin@noroff.no" },
                name: { type: "string", example: "Admin Support" },
                roleId: { type: "integer", example: 1 },
                token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
              },
            },
          },
        },
        //Product
        Product: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "iPhone 6s Plus 16Gb" },
            description: { type: "string", example: "3D Touch. 12MP photos. 4K video." },
            unitPrice: { type: "string", description: "DECIMAL(10,2) returned as string by MySQL", example: "649.00" },
            quantity: { type: "integer", example: 2 },
            imgUrl: { type: "string", format: "uri", example: "http://images.restapi.co/posters/beauty/01-702004.png" },
            dateAdded: { type: "string", format: "date-time", example: "2024-10-20T08:30:00.000Z" },
            isDeleted: {
              type: "integer",
              enum: [0, 1],
              description:
                "0 = active, 1 = soft-deleted. MySQL TINYINT returned as integer via raw SQL. When updating, send boolean false to restore.",
              example: 0,
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            brandId: { type: "integer", example: 1 },
            categoryId: { type: "integer", example: 1 },
            brand: { type: "string", example: "Apple" },
            category: { type: "string", example: "Phones" },
          },
        },
        CreateProductRequest: {
          type: "object",
          required: ["name", "description", "unitPrice", "quantity", "imgUrl", "brandId", "categoryId"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 255, example: "TEST_PRODUCT" },
            description: { type: "string", maxLength: 2000, example: "A test product description" },
            unitPrice: { type: "number", format: "float", minimum: 0, exclusiveMinimum: true, example: 99.99 },
            quantity: { type: "integer", minimum: 0, example: 10 },
            imgUrl: { type: "string", format: "uri", example: "http://images.example.com/product.png" },
            dateAdded: { type: "string", format: "date-time", description: "Defaults to current date if omitted" },
            brandId: { type: "integer", minimum: 1, example: 1 },
            categoryId: { type: "integer", minimum: 1, example: 1 },
          },
        },
        UpdateProductRequest: {
          type: "object",
          minProperties: 1,
          description: "At least one field must be provided.",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 255 },
            description: { type: "string", maxLength: 2000 },
            unitPrice: { type: "number", format: "float", minimum: 0, exclusiveMinimum: true },
            quantity: { type: "integer", minimum: 0 },
            imgUrl: { type: "string", format: "uri" },
            dateAdded: { type: "string", format: "date-time" },
            brandId: { type: "integer", minimum: 1 },
            categoryId: { type: "integer", minimum: 1 },
            isDeleted: {
              type: "boolean",
              enum: [false],
              description:
                "Can only be set to false (restore a soft-deleted product). Send as boolean - returned as integer 0 in GET responses (MySQL TINYINT via raw SQL).",
            },
          },
        },
        //Brand
        Brand: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Apple" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        BrandRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100, example: "TEST_BRAND" },
          },
        },
        //Category
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Phones" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        CategoryRequest: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", minLength: 1, maxLength: 100, example: "TEST_CATEGORY" },
          },
        },
        //Cart
        CartItem: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            cartId: { type: "integer", example: 1 },
            productId: { type: "integer", example: 5 },
            quantity: { type: "integer", example: 2 },
            product: {
              type: "object",
              properties: {
                id: { type: "integer", example: 5 },
                name: { type: "string", example: "iPhone 6s Plus 16Gb" },
                unitPrice: { type: "string", description: "DECIMAL(10,2) returned as string", example: "649.00" },
                quantity: { type: "integer", description: "Available stock", example: 10 },
                imgUrl: { type: "string", format: "uri" },
                isDeleted: { type: "boolean", example: false },
              },
            },
          },
        },
        Cart: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            userId: { type: "integer", example: 2 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/CartItem" },
            },
          },
        },
        AddItemRequest: {
          type: "object",
          required: ["productId"],
          properties: {
            productId: { type: "integer", minimum: 1, example: 5 },
            quantity: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 1,
              description: "Defaults to 1 if omitted",
              example: 2,
            },
          },
        },
        UpdateItemRequest: {
          type: "object",
          required: ["quantity"],
          properties: {
            quantity: { type: "integer", minimum: 1, maximum: 100, example: 3 },
          },
        },
        //Order
        OrderSummary: {
          type: "object",
          description: "Order without line items. Returned by list and status-update endpoints.",
          properties: {
            id: { type: "integer", example: 1 },
            orderNumber: { type: "string", example: "6ad4JHid" },
            userId: { type: "integer", example: 2 },
            discountPercentAtPurchase: { type: "integer", example: 0 },
            membershipNameAtPurchase: { type: "string", example: "Bronze" },
            totalAmount: {
              type: "string",
              description: "DECIMAL(10,2) returned as string. Post-discount order total computed at checkout.",
              example: "1298.00",
            },
            orderStatusId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            user: {
              type: "object",
              description: "Only present in admin responses",
              nullable: true,
              properties: {
                id: { type: "integer", example: 2 },
                username: { type: "string", example: "bobbybob" },
                email: { type: "string", example: "bobby@example.com" },
              },
            },
            orderStatus: { $ref: "#/components/schemas/OrderStatus" },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            orderId: { type: "integer", example: 1 },
            productId: { type: "integer", example: 5 },
            quantity: { type: "integer", example: 2 },
            unitPriceAtPurchase: { type: "string", description: "DECIMAL(10,2) returned as string", example: "649.00" },
            productNameAtPurchase: { type: "string", example: "iPhone 6s Plus 16Gb" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        OrderStatus: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "In Progress" },
          },
        },
        OrderUserView: {
          type: "object",
          description: "Order as seen by the owning user",
          properties: {
            id: { type: "integer", example: 1 },
            orderNumber: { type: "string", minLength: 8, maxLength: 8, example: "6ad4JHid" },
            userId: { type: "integer", example: 2 },
            discountPercentAtPurchase: { type: "integer", example: 0 },
            membershipNameAtPurchase: { type: "string", example: "Bronze" },
            totalAmount: {
              type: "string",
              description: "DECIMAL(10,2) returned as string. Post-discount order total computed at checkout.",
              example: "1298.00",
            },
            orderStatusId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            orderStatus: { $ref: "#/components/schemas/OrderStatus" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
          },
        },
        OrderAdminView: {
          type: "object",
          description: "Order as seen by admin (includes user details and product info on items)",
          properties: {
            id: { type: "integer", example: 1 },
            orderNumber: { type: "string", example: "6ad4JHid" },
            userId: { type: "integer", example: 2 },
            discountPercentAtPurchase: { type: "integer", example: 0 },
            membershipNameAtPurchase: { type: "string", example: "Bronze" },
            totalAmount: {
              type: "string",
              description: "DECIMAL(10,2) returned as string. Post-discount order total computed at checkout.",
              example: "1298.00",
            },
            orderStatusId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            user: {
              type: "object",
              properties: {
                id: { type: "integer", example: 2 },
                username: { type: "string", example: "bobbybob" },
                email: { type: "string", example: "bobby@example.com" },
              },
            },
            orderStatus: { $ref: "#/components/schemas/OrderStatus" },
            items: {
              type: "array",
              items: { $ref: "#/components/schemas/OrderItem" },
            },
          },
        },
        UpdateOrderStatusRequest: {
          type: "object",
          required: ["orderStatusId"],
          properties: {
            orderStatusId: {
              type: "integer",
              minimum: 1,
              description: "1 = In Progress, 2 = Ordered, 3 = Completed",
              example: 2,
            },
          },
        },
        //User
        Role: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Admin" },
          },
        },
        Membership: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Bronze" },
            threshold: { type: "integer", description: "Minimum total purchased quantity to qualify", example: 0 },
            discountPercent: { type: "integer", example: 0 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 2 },
            username: { type: "string", example: "bobbybob" },
            email: { type: "string", example: "bobby@example.com" },
            firstName: { type: "string", example: "Bob" },
            lastName: { type: "string", example: "Bobby" },
            address: { type: "string", example: "123 Bobs gate" },
            city: { type: "string", example: "Oslo" },
            phone: { type: "string", example: "12345678" },
            totalPurchasedQuantity: { type: "integer", example: 0 },
            roleId: { type: "integer", example: 2 },
            membershipId: { type: "integer", example: 1 },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            role: { $ref: "#/components/schemas/Role" },
            membership: { $ref: "#/components/schemas/Membership" },
          },
        },
        UpdateUserRequest: {
          type: "object",
          minProperties: 1,
          description: "At least one field must be provided.",
          properties: {
            firstName: { type: "string", minLength: 2, maxLength: 100 },
            lastName: { type: "string", minLength: 2, maxLength: 100 },
            username: { type: "string", minLength: 3, maxLength: 50 },
            email: { type: "string", format: "email" },
            address: { type: "string", minLength: 1, maxLength: 255 },
            city: { type: "string", minLength: 2, maxLength: 100 },
            phone: { type: "string", pattern: "^\\d+$", minLength: 3, maxLength: 32 },
          },
        },
        UpdateRoleRequest: {
          type: "object",
          required: ["roleId"],
          properties: {
            roleId: { type: "integer", minimum: 1, description: "1 = Admin, 2 = User", example: 1 },
          },
        },
        UpdateDiscountRequest: {
          type: "object",
          required: ["discountPercent"],
          properties: {
            discountPercent: { type: "integer", minimum: 0, maximum: 100, example: 15 },
          },
        },
        //Search
        SearchRequest: {
          type: "object",
          description:
            "At least one of name, brand, or category must be provided. Multiple fields narrow the search (AND logic).",
          properties: {
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Partial product name match",
              example: "iPhone",
            },
            brand: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Partial brand name match",
              example: "Apple",
            },
            category: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              description: "Partial category name match",
              example: "Phones",
            },
          },
        },
      },
    },
    security: [],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
