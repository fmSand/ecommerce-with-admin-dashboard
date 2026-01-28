const { hashPassword } = require("../utils/hash");
const AppError = require("../utils/AppError");
const { ORDER_STATUSES, ROLES, MEMBERSHIPS, ADMIN_USER } = require("../constants/seedData");

async function initializeDatabase(db, noroffResponse) {
  const products = noroffResponse?.data;

  if (!Array.isArray(products) || products.length === 0) {
    throw new AppError(502, "Invalid Noroff data");
  }

  const transaction = await db.sequelize.transaction();
  try {
    const productCount = await db.Product.count({ transaction });

    if (productCount > 0) {
      await transaction.commit();
      return { alreadyInitialized: true };
    }

    await seedRoles(db, transaction);
    await seedMemberships(db, transaction);
    await seedOrderStatuses(db, transaction);
    await seedAdminUser(db, transaction);
    await seedBrandsCategoriesProducts(db, products, transaction);

    await transaction.commit();
    return { alreadyInitialized: false };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

async function seedRoles(db, transaction) {
  for (const role of ROLES) {
    await db.Role.upsert(role, { transaction });
  }
}

async function seedMemberships(db, transaction) {
  for (const membership of MEMBERSHIPS) {
    await db.Membership.upsert(membership, { transaction });
  }
}

async function seedOrderStatuses(db, transaction) {
  for (const status of ORDER_STATUSES) {
    await db.OrderStatus.upsert(status, { transaction });
  }
}

async function seedAdminUser(db, transaction) {
  const bronze = await db.Membership.findOne({ where: { name: "Bronze" }, transaction });
  if (!bronze) throw new AppError(500, "Cannot create admin: Bronze membership missing");

  const existing = await db.User.findOne({
    where: {
      username: ADMIN_USER.username,
      roleId: 1,
    },
    transaction,
  });
  if (existing) return;

  const passwordHash = await hashPassword(ADMIN_USER.password);

  await db.User.create(
    {
      username: ADMIN_USER.username,
      email: ADMIN_USER.email,
      firstName: ADMIN_USER.firstName,
      lastName: ADMIN_USER.lastName,
      address: ADMIN_USER.address,
      city: ADMIN_USER.city,
      phone: ADMIN_USER.phone,
      passwordHash,
      roleId: 1,
      membershipId: bronze.id,
      totalPurchasedQuantity: 0,
    },
    { transaction },
  );
}

async function seedBrandsCategoriesProducts(db, products, transaction) {
  const { Brand, Category, Product } = db;

  const brandNames = [...new Set(products.map((p) => p.brand))].filter(Boolean);
  await Brand.bulkCreate(
    brandNames.map((name) => ({ name })),
    {
      transaction,
      ignoreDuplicates: true,
    },
  );
  const brands = await Brand.findAll({ transaction });
  const brandIdByName = new Map(brands.map((b) => [b.name, b.id]));

  const categoryNames = [...new Set(products.map((p) => p.category))].filter(Boolean);
  await Category.bulkCreate(
    categoryNames.map((name) => ({ name })),
    {
      transaction,
      ignoreDuplicates: true,
    },
  );
  const categories = await Category.findAll({ transaction });
  const categoryIdByName = new Map(categories.map((c) => [c.name, c.id]));

  const productRows = products.map((p) => ({
    name: p.name,
    description: p.description,
    unitPrice: p.price,
    quantity: p.quantity,
    imgUrl: p.imgurl,
    dateAdded: new Date(p.date_added),
    isDeleted: false,
    brandId: brandIdByName.get(p.brand),
    categoryId: categoryIdByName.get(p.category),
  }));

  if (productRows.some((r) => !r.brandId || !r.categoryId)) {
    throw new AppError(500, "Product seed failed: missing brandId/categoryId mapping");
  }

  await Product.bulkCreate(productRows, { transaction });
}

module.exports = { initializeDatabase };
