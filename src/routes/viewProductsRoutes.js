const { Router } = require("express");

const viewProductsRoutesFn = (io) => {
  const pagesFn = require("../controllers/productsViewControllers");

  const {
    home,
    homeById,
    createProducts,
    realTimeProducts,
    realTimeProductById,
    postRealTimeProducts,
    updateRealTimeProducts,
    deleteRealTimeProducts,
  } = pagesFn(io);

  const router = Router();

  router.get("/home", home);

  router.get("/home/:pid", homeById);

  router.get("/createProducts", createProducts); // Con este metodo creo 100 productos

  router.get( "/realTimeProducts",
    (req, res, next) => {
        if (!req.user) {
        res.redirect("/login");
      }
      return next();
    },
    realTimeProducts
  );

  router.get("/realTimeProducts/:pid", realTimeProductById);

  router.post("/realTimeProducts", postRealTimeProducts);

  router.put("/realTimeProducts/:pid", updateRealTimeProducts);

  router.delete("/realTimeProducts/:pid", deleteRealTimeProducts);

  return router;
};

module.exports = viewProductsRoutesFn;
