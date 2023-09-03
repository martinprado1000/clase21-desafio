//const { ProductManager } = require("../dao/productManager");
const { ProductManagerDb } = require("../dao/productManagerDb");

const pagesFn = (io) => {
  //instacio el manager
  //const manager = new ProductManager("db/products.json", io);
  const manager = new ProductManagerDb(io);

  //get Products
  const home = async (req, res) => {
    try {
      const limitInt = parseInt(req.query.limit);
      const data = await manager.getProducts();
      if (!limitInt) {
        res.render("home.handlebars", { data });
      } else {
        const dataLimit = data.slice(0, limitInt);
        //res.json(dataLimit);
        res.render("home.handlebars", dataLimit);
      }
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  //get ProductById
  const homeById = async (req, res) => {
    try {
      const pid = parseInt(req.params.pid);
      const data = await manager.getProductById(pid);
      res.render("home.handlebars", { data });
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  const createProducts = async (req, res) => { // Con este metodo creo 100 productos
    try {
      await manager.createProducts();
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  // const realTimeProducts = async (req, res) => {
  //   try {
  //     // const limitInt = parseInt(req.query.limit);
  //     const data = await manager.getProducts();
  //     res.render("realTimeProductsDb.handlebars", {data});
  //   } catch (e) {
  //     console.log(e);
  //     return { Error: "Algo salio mal con la consulta" };
  //   }
  // };

  const realTimeProducts = async (req, res) => {
    try {
      const userSession = req.user.name;// Recordar que con passport la session se guarda en req.user
      const query = req.query;
      const response = await manager.getProductsPaginate(query);
      const data = response.data 
      // if (user.rol == "admin") {
      //   res.json({  
      //     status: 200,
      //     data: `Usuario admin: ${user.email} a iniciado sesion`,
      //   });  
      // } else {
      //   res.json({ status: 200, data: `${user.email} a iniciado sesion` });
      // }    
      res.render("realTimeProductsDb.handlebars", {data , userSession});
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };
  const realTimeProductById = async (req, res) => {
    try {
      const pid = req.params.pid;
      const data = await manager.getProductById(pid);                                                                                                          
      //console.log(data.respuesta)
      const product = data.respuesta
      res.json(product);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  const postRealTimeProducts = async (req, res) => {
    try {
      const product = req.body;
      const data = await manager.addProduct(product);
      res.json(data);
      // if ( data.status == 400 ) {
      //   console.log(data.status)
      //   console.log("1")
      //   res.render("error.handlebars", data);
      // } else {
      //   console.log(data.status)
      //   console.log("2")
      //   res.json(data);
      // }
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };

  const deleteRealTimeProducts = async (req, res) => {
    try {
      const pid = req.params.pid;
      //console.log(pid)
      const data = await manager.deleteProduct(pid);
      res.json(data);
    } catch (e) {
      console.log(e);
      return { Error: "Algo salio mal con la consulta" };
    }
  };
  
  const updateRealTimeProducts = async (req, res) => {
    try{
      const pid = req.params.pid;
      const product = req.body;
      const data = await manager.updateProduct(pid,product);
      //console.log(data)
      //res.status(data.status).send(data.respuesta);
      //res.render("realTimeProductsDb.handlebars", {data});
      //res.json(data);
    } catch(e) {
      console.log(e);
      return { "Error" : "Algo salio mal con la consulta"}
    }
  }

  return {
    home,
    homeById,
    createProducts,
    realTimeProducts,
    realTimeProductById,
    postRealTimeProducts,
    updateRealTimeProducts,
    deleteRealTimeProducts
  };
};

module.exports = pagesFn;
