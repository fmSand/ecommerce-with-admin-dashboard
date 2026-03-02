const router = require("express").Router();
const api = require("../utils/apiClient");
const { mapFieldErrors, mapFormError } = require("../utils/formErrors");

router.get("/", async (req, res, next) => {
  try {
    const [productData, brandData, categoryData] = await Promise.all([
      api.get("/products", req),
      api.get("/brands", req),
      api.get("/categories", req),
    ]);
    res.render("products/index", {
      title: "Products",
      pageTitle: "Products",
      active: "products",
      products: productData.products,
      brands: brandData.brands,
      categories: categoryData.categories,
      searchQuery: {},
      searched: false,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/search", async (req, res, next) => {
  const { name, brand, category } = req.body;
  const searchQuery = { name, brand, category };

  if (!name && !brand && !category) {
    return res.redirect("/products");
  }

  try {
    const [searchData, brandData, categoryData] = await Promise.all([
      api.post("/search", req, searchQuery),
      api.get("/brands", req),
      api.get("/categories", req),
    ]);
    res.render("products/index", {
      title: "Products — Search",
      pageTitle: "Products",
      active: "products",
      products: searchData.products,
      brands: brandData.brands,
      categories: categoryData.categories,
      searchQuery,
      searched: true,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/new", async (req, res, next) => {
  try {
    const [brandData, categoryData] = await Promise.all([api.get("/brands", req), api.get("/categories", req)]);
    res.render("products/new", {
      title: "Add Product",
      pageTitle: "Add Product",
      active: "products",
      brands: brandData.brands,
      categories: categoryData.categories,
      formData: null,
      fieldErrors: {},
      formError: null,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res) => {
  const body = {
    name: req.body.name,
    description: req.body.description,
    unitPrice: Number(req.body.unitPrice),
    quantity: Number(req.body.quantity),
    imgUrl: req.body.imgUrl || undefined,
    brandId: Number(req.body.brandId),
    categoryId: Number(req.body.categoryId),
  };

  try {
    await api.post("/products", req, body);
    req.session.flash = { type: "success", message: "Product created" };
    return res.redirect("/products");
  } catch (err) {
    if (err.statusCode === 400 && err.data?.details) {
      try {
        const [brandData, categoryData] = await Promise.all([api.get("/brands", req), api.get("/categories", req)]);
        return res.status(400).render("products/new", {
          title: "Add Product",
          pageTitle: "Add Product",
          active: "products",
          brands: brandData.brands,
          categories: categoryData.categories,
          formData: req.body,
          fieldErrors: mapFieldErrors(err.data?.details),
          formError: mapFormError(err.data?.details),
        });
      } catch (err) {
        //fall through if fail
      }
    }

    req.session.flash = { type: "danger", message: err.message };
    return res.redirect("/products/new");
  }
});

router.get("/:id/edit", async (req, res, next) => {
  try {
    const [productData, brandData, categoryData] = await Promise.all([
      api.get(`/products/${req.params.id}`, req),
      api.get("/brands", req),
      api.get("/categories", req),
    ]);

    res.render("products/edit", {
      title: `Edit: ${productData.product.name}`,
      pageTitle: "Edit Product",
      active: "products",
      product: productData.product,
      brands: brandData.brands,
      categories: categoryData.categories,
      formData: null,
      fieldErrors: {},
      formError: null,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/edit", async (req, res) => {
  const body = {
    name: req.body.name,
    description: req.body.description,
    unitPrice: Number(req.body.unitPrice),
    quantity: Number(req.body.quantity),
    imgUrl: req.body.imgUrl || undefined,
    brandId: Number(req.body.brandId),
    categoryId: Number(req.body.categoryId),
  };

  try {
    await api.put(`/products/${req.params.id}`, req, body);
    req.session.flash = { type: "success", message: "Product updated" };
    return res.redirect("/products");
  } catch (err) {
    if (err.statusCode === 400 && err.data?.details) {
      try {
        const [productData, brandData, categoryData] = await Promise.all([
          api.get(`/products/${req.params.id}`, req),
          api.get("/brands", req),
          api.get("/categories", req),
        ]);

        return res.status(400).render("products/edit", {
          title: `Edit: ${productData.product.name}`,
          pageTitle: "Edit Product",
          active: "products",
          product: productData.product,
          brands: brandData.brands,
          categories: categoryData.categories,
          formData: req.body,
          fieldErrors: mapFieldErrors(err.data?.details),
          formError: mapFormError(err.data?.details),
        });
      } catch {
        //fall through if fail
      }
    }

    req.session.flash = { type: "danger", message: err.message };
    return res.redirect(`/products/${req.params.id}/edit`);
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    await api.delete(`/products/${req.params.id}`, req);
    req.session.flash = { type: "success", message: "Product deleted" };
  } catch (err) {
    req.session.flash = { type: "danger", message: err.message };
  }
  res.redirect("/products");
});

router.post("/:id/restore", async (req, res) => {
  try {
    await api.put(`/products/${req.params.id}`, req, { isDeleted: false });
    req.session.flash = { type: "success", message: "Product restored" };
  } catch (err) {
    req.session.flash = { type: "danger", message: err.message };
  }
  res.redirect("/products");
});

module.exports = router;
