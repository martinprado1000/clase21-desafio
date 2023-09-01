const { Router } = require("express");

const cartsRoutesFn = ((io) => {
    
  const pagesFn = require("../controllers/cartsControllers");

  const { carts, cartId, cartAdd, cartAddPid, /*cartDelete,*/ cartProductsDelete, cartProductDelete, cartPut, cartPutPid } = pagesFn(io);

  const router = Router();

  router.get("/carts", carts);

  router.get("/carts/:pid", cartId);

  router.post("/carts", cartAdd);

  router.post("/carts/:cid/product/:pid", cartAddPid);

  router.put("/carts/:cid", cartPut);

  router.put("/carts/:cid/product/:pid", cartPutPid);

  //router.delete("/carts/:cid", cartDelete);

  router.delete("/carts/:cid", cartProductsDelete);

  router.delete("/carts/:cid/product/:pid", cartProductDelete);

  return router;
});

module.exports = cartsRoutesFn;