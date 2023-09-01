//const { CartManager } = require("../dao/cartManager");
const { CartManager } = require("../dao/cartManagerDb");
//const { ProductManagerDb } = require("../dao/ProductManagerDb");

const pagesFn = (io) => {
  const manager = new CartManager(io);

  //get Carts
  const carts = async (req, res) => {
    try {
      const limitInt = parseInt(req.query.limit);
      //console.log(limitInt);
      const data = await manager.getCarts();
      //console.log(data);
      if (!limitInt) {
        //console.log("respondemos sin limite");
        //console.log(data)
        res.setHeader("Content-Type", "application/json");
        res.json({ data });
      } else {
        //const dataLimit = data.slice(0, limitInt);
        const dataLimit = await manager.getCartsLimit(limitInt);
        res.json(dataLimit);
      }
      return;
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  //get ProductById
  const cartId = async (req, res) => {
    try {
      const pid = req.params.pid;
      const data = await manager.getCartById(pid);
      res.status(data.status).json(data.respuesta);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  //post Product
  const cartAdd = async (req, res) => {
    try {
      //console.log(req.session.email);
      const data = {
        email: req.session.email,
        products: req.body,
      };
      //console.log(data);
      const result = await manager.addCart(data);
      res.status(result.status).send(result.respuesta);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  //post Product pid
  const cartAddPid = async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const data = req.body;
      const result = await manager.addCartPid(cid, pid, data);
      res.status(result.status).send(result.respuesta);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  // Put
  const cartPut = async (req, res) => {
    try {
      const cid = req.params.cid;
      const products = req.body;
      const data = await manager.updateCart(cid, products);
      // res.status(data.status).send(data.respuesta);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  // Put pid
  const cartPutPid = async (req, res) => {
    try {
      const pid = req.params.pid;
      const cart = req.body;
      const data = await manager.updateCartPid(pid, cart);
      res.status(data.status).send(data.respuesta);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  // //Elimina el carrito entero
  // const cartDelete = async (req, res) => {
  //   try {
  //     const cart = req.params.pid;
  //     console.log(req.params)
  //     const data = await manager.deleteCart(cart);
  //     res.status(data.status).send(data.respuesta);
  //     res.status(data.status).send(data.respuesta);
  //   } catch (e) {
  //     console.log(e);
  //     return { Error: "Algo salio mal con la consulta" };
  //   }
  // };

  //Elimina todos los productos carrito.
  const cartProductsDelete = async (req, res) => {
    try {
      const cart = req.params.cid;
      const data = await manager.deleteCartProducts(cart);
      console.log(data);
      res.status(data.status).send(data.respuesta);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  const cartProductDelete = async (req, res) => {
    try {
      const cid = req.params.cid;
      const pid = req.params.pid;
      const data = await manager.deleteCartProduct(cid, pid);
      res.status(data.status).send(data.respuesta);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  return {
    carts,
    cartId,
    cartAdd,
    cartAddPid,
    cartPut,
    cartPutPid,
    //cartDelete,
    cartProductsDelete,
    cartProductDelete,
  };
};

module.exports = pagesFn;
