const request = require("supertest");
const { Op } = require("sequelize");
const app = require("../app");
const db = require("../models");
const { generateToken } = require("../utils/jwt");
const { ADMIN_ROLE_ID, USER_ROLE_ID } = require("../constants/roles");
process.env.JWT_SECRET = process.env.JWT_SECRET || "secret";

//HELPERS
function expectEnvelope(res) {
  expect(res.body).toHaveProperty("status");
  expect(res.body).toHaveProperty("statuscode");
  expect(res.body).toHaveProperty("data");
  expect(res.body.data).toHaveProperty("result");
}

function bearer(token) {
  return { Authorization: `Bearer ${token}` };
}

const adminToken = generateToken({ id: 999999, roleId: ADMIN_ROLE_ID });
const userToken = generateToken({ id: 111111, roleId: USER_ROLE_ID });
const TEST_CATEGORY = "TEST_CATEGORY";
const TEST_CATEGORY2 = "TEST_CATEGORY2";
const TEST_BRAND = "TEST_BRAND";
const TEST_BRAND2 = "TEST_BRAND2";
const TEST_PRODUCT = "TEST_PRODUCT";

const created = { categoryId: null, brandId: null, productId: null };

beforeAll(async () => {
  await db.sequelize.authenticate();
});

afterAll(async () => {
  try {
    if (db.Product) await db.Product.destroy({ where: { name: { [Op.in]: [TEST_PRODUCT] } } });
    if (db.Brand) await db.Brand.destroy({ where: { name: { [Op.in]: [TEST_BRAND, TEST_BRAND2] } } });
    if (db.Category) await db.Category.destroy({ where: { name: { [Op.in]: [TEST_CATEGORY, TEST_CATEGORY2] } } });
  } finally {
    await db.sequelize.close();
  }
});

//SEQUENTIAL FLOW:
describe("Required CRUD tests", () => {
  test("Spec CRUD flow — steps 1 through 8", async () => {
    //1. Add a category with the name TEST_CATEGORY
    const createCategoryRes = await request(app)
      .post("/categories")
      .set(bearer(adminToken))
      .send({ name: TEST_CATEGORY });

    expect(createCategoryRes.statusCode).toBe(201);
    expectEnvelope(createCategoryRes);
    expect(createCategoryRes.body.data.category.name).toBe(TEST_CATEGORY);
    created.categoryId = createCategoryRes.body.data.category.id;
    expect(created.categoryId).toBeDefined();

    //2. Add a brand with the name TEST_BRAND
    const createBrandRes = await request(app).post("/brands").set(bearer(adminToken)).send({ name: TEST_BRAND });

    expect(createBrandRes.statusCode).toBe(201);
    expectEnvelope(createBrandRes);
    expect(createBrandRes.body.data.brand.name).toBe(TEST_BRAND);
    created.brandId = createBrandRes.body.data.brand.id;
    expect(created.brandId).toBeDefined();

    //3. Add a product with the name TEST_PRODUCT, brand TEST_BRAND, category TEST_CATEGORY, quantity 10, price 99.99
    const createProductRes = await request(app).post("/products").set(bearer(adminToken)).send({
      name: TEST_PRODUCT,
      description: "Test product",
      unitPrice: 99.99,
      quantity: 10,
      imgUrl: "https://example.com/test.jpg",
      brandId: created.brandId,
      categoryId: created.categoryId,
    });

    expect(createProductRes.statusCode).toBe(201);
    expectEnvelope(createProductRes);
    expect(createProductRes.body.data.product.name).toBe(TEST_PRODUCT);
    expect(Number(createProductRes.body.data.product.unitPrice)).toBeCloseTo(99.99, 2);
    expect(Number(createProductRes.body.data.product.quantity)).toBe(10);
    created.productId = createProductRes.body.data.product.id;
    expect(created.productId).toBeDefined();

    //4. Get the newly created TEST_PRODUCT with all information, including category and brand name
    const getProductRes = await request(app).get(`/products/${created.productId}`);

    expect(getProductRes.statusCode).toBe(200);
    expectEnvelope(getProductRes);
    const product = getProductRes.body.data.product;
    expect(product.name).toBe(TEST_PRODUCT);
    expect(Number(product.unitPrice)).toBeCloseTo(99.99, 2);
    expect(Number(product.quantity)).toBe(10);
    expect(product.brandId).toBe(created.brandId);
    expect(product.categoryId).toBe(created.categoryId);
    expect(product.brand).toBe(TEST_BRAND);
    expect(product.category).toBe(TEST_CATEGORY);

    //5. Change the category name TEST_CATEGORY to TEST_CATEGORY2
    const updateCategoryRes = await request(app)
      .put(`/categories/${created.categoryId}`)
      .set(bearer(adminToken))
      .send({ name: TEST_CATEGORY2 });

    expect(updateCategoryRes.statusCode).toBe(200);
    expectEnvelope(updateCategoryRes);
    expect(updateCategoryRes.body.data.category.id).toBe(created.categoryId);
    expect(updateCategoryRes.body.data.category.name).toBe(TEST_CATEGORY2);

    //6. Change the brand name TEST_BRAND to TEST_BRAND2
    const updateBrandRes = await request(app)
      .put(`/brands/${created.brandId}`)
      .set(bearer(adminToken))
      .send({ name: TEST_BRAND2 });

    expect(updateBrandRes.statusCode).toBe(200);
    expectEnvelope(updateBrandRes);
    expect(updateBrandRes.body.data.brand.id).toBe(created.brandId);
    expect(updateBrandRes.body.data.brand.name).toBe(TEST_BRAND2);

    //7. Get the product TEST_PRODUCT with all information, including the updated category and brand name
    const getProductAfterRenameRes = await request(app).get(`/products/${created.productId}`);

    expect(getProductAfterRenameRes.statusCode).toBe(200);
    expectEnvelope(getProductAfterRenameRes);
    const renamedProduct = getProductAfterRenameRes.body.data.product;
    expect(renamedProduct.name).toBe(TEST_PRODUCT);
    expect(renamedProduct.brand).toBe(TEST_BRAND2);
    expect(renamedProduct.category).toBe(TEST_CATEGORY2);

    //8. Delete the TEST_PRODUCT
    const deleteProductRes = await request(app).delete(`/products/${created.productId}`).set(bearer(adminToken));

    expect(deleteProductRes.statusCode).toBe(200);
    expectEnvelope(deleteProductRes);

    //Soft delete (guests)
    const guestRes = await request(app).get("/products");
    expect(guestRes.statusCode).toBe(200);
    const guestProducts = guestRes.body.data.products;
    expect(Array.isArray(guestProducts)).toBe(true);
    expect(guestProducts.find((p) => p.id === created.productId)).toBeUndefined();

    //Soft delete (admin))
    const adminRes = await request(app).get("/products").set(bearer(adminToken));
    expect(adminRes.statusCode).toBe(200);
    const deletedProduct = adminRes.body.data.products.find((p) => p.id === created.productId);
    expect(deletedProduct).toBeTruthy();
    expect(deletedProduct.isDeleted).toBeTruthy();
  });
});

//EXTRA: Error handling and authentication tests
describe("Additional tests — error handling and authentication", () => {
  test("Protected endpoints reject requests with no token", async () => {
    const res = await request(app).post("/brands").send({ name: "AUTH_TEST_BRAND" });
    expect(res.statusCode).toBe(401);
    expectEnvelope(res);
    expect(res.body.data.result).toBe("Token not provided");
  });

  test("Protected endpoints reject non-admin users", async () => {
    const res = await request(app).post("/brands").set(bearer(userToken)).send({ name: "AUTH_TEST_BRAND" });
    expect(res.statusCode).toBe(403);
    expectEnvelope(res);
    expect(res.body.data.result).toBe("Admin access required");
  });

  test("Missing required fields return 400 with validation error details", async () => {
    const res = await request(app).post("/brands").set(bearer(adminToken)).send({});
    expect(res.statusCode).toBe(400);
    expectEnvelope(res);
    expect(res.body.data.result).toBe("Validation error");
    expect(Array.isArray(res.body.data.details)).toBe(true);
    expect(res.body.data.details.some((d) => d.field === "name")).toBe(true);
  });

  test("Invalid foreign key IDs return 400 with 'Invalid reference ID'", async () => {
    const res = await request(app).post("/products").set(bearer(adminToken)).send({
      name: "FK_TEST_PRODUCT",
      description: "Test description",
      unitPrice: 10.0,
      quantity: 1,
      imgUrl: "https://example.com/test.jpg",
      brandId: 99999999,
      categoryId: 99999999,
    });
    expect(res.statusCode).toBe(400);
    expectEnvelope(res);
    expect(res.body.data.result).toBe("Invalid reference ID");
  });

  test("Malformed Authorization header returns 401", async () => {
    const res = await request(app).get("/products").set("Authorization", "Token definitely.jwt.trust");
    expect(res.statusCode).toBe(401);
    expectEnvelope(res);
    expect(res.body.data.result).toBe("Invalid Authorization header format");
  });
});
