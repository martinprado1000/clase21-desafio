const { ProductManager } = require("../dao/productManager");

//instacio el manager
const manager = new ProductManager("db/products.json");

//get Products
const products = async (req, res) => {
  try {
    const limitInt = parseInt(req.query.limit);
    //console.log(limitInt);
    const data = await manager.getProducts();
    if (!limitInt) res.json(data);
    else {
      const dataLimit = data.slice(0, limitInt);
      res.json(dataLimit);
    }
  } catch (e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//get ProductById
const productId = async (req, res) => {
  try{
    const pid = parseInt(req.params.pid);
    const data = await manager.getProductById(pid);
    res.status(data.status).json(data.respuesta);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//post Product
const productAdd = async (req, res) => {
  try{
    const product = req.body;
    const data = await manager.addProduct(product);
    res.status(data.status).send(data.respuesta);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//put Product
const productPut = async (req, res) => {
  try{
    const pid = req.params.pid;
    const product = req.body;
    const data = await manager.updateProduct(pid,product);
    res.status(data.status).send(data.respuesta);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

//delete Product
const productDelete = async (req, res) => {
  try{
    const product = req.params.pid;
    const data = await manager.deleteProduct(product);
    res.status(data.status).send(data.respuesta);
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

module.exports = { products, productId, productAdd, productDelete, productPut }