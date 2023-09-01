const { Router } = require("express");

const productsRoutesFn = (io) => {
  const pagesFn = require("../controllers/productsControllersDb");

  const { products, productId, productAdd, productPut, productDelete } = pagesFn(io);

  const router = Router();

  router.get("/products", products);

  router.get("/products/:pid", productId);

  router.post("/products", productAdd);

  router.put("/products/:pid", productPut);

  router.delete("/products/:pid", productDelete);

  return router;
};

module.exports = productsRoutesFn;
