const fs = require("fs");
const productsModel = require("../models/productModel");
const cartModel = require("../models/cartModel");
//const { ProductManagerDb } = require("../dao/ProductManagerDb");

// const { ProductManagerDb } = require("../dao/ProductManagerDb");
// const products = (async() => {
//   const managerProduct = new ProductManagerDb(io);
//   const products = await managerProduct.getProducts();
//   //console.log(products);
// });
// products();

class CartManager {
  constructor(io, products) {
    this.io = io;
    this.products = products;
  }

  async getCarts() {
    try {
      //const carts = await cartModel.find();
      const carts = await cartModel.find().populate("products.product");
      return carts;
    } catch (e) {
      console.log("Error al leer el archivo Carts");
      return {
        status: 500,
        respuesta: "Error desconocido al leer el archivo Carts",
      };
    }
  }

  async getCartsLimit(lim) {
    try {
      const cartsObj = cartModel.find().limit(lim);
      return cartsObj;
    } catch (e) {
      console.log("Error al leer el archivo Carts");
      return {
        status: 500,
        respuesta: "Error desconocido al leer el archivo Carts",
      };
    }
  }

  async getCartById(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID valido");
        return { status: 400, respuesta: "Debe enviar un ID valido" };
      }
      let cartId = await cartModel.findById(id).populate("products.product");;
      //console.log(cartId);
      if (cartId)
        return {
          status: 200,
          respuesta: cartId,
        };
      return {
        status: 400,
        respuesta: `El carrrito con id: ${id} no existe`,
      };
    } catch (e) {
      console.log("Error desconocido");
      return {
        status: 500,
        respuesta: "Error desconocido",
      };
    }
  }

  async addCart(data) {
    // *********************************************
    // Ejemplo del objeto que tengo que enviar:
    // {
    //   "email": "b@gmail.com",
    //   "products": [
    //     {
    //       "product": "64d8ad5ac3a34554a9904b39",
    //       "quantity": 10
    //     }
    //   ]
    // }  
    // *********************************************
    try {
      //console.log(data)
      const cart = await cartModel.findOne({ email: data.email });
      //console.log(data.products[0].product)  // Id del producto a agregar
      if (cart == null) {
        // Si el carrito no existe lo creo
        console.log("no existe el carrito, lo creo");
        const cart = await cartModel.create({ email: data.email });
        //console.log(cart)
      }

      const prod = data.products[0]; // Objeto con el producto a agregar o sumar
      const cartFound = await cartModel.findOne({ email: data.email }); // Carrito existente
    
      const productFoundInCart = cartFound.products.find(
        (p) => p.product == data.products[0].product
      );
      console.log(productFoundInCart);

      if (productFoundInCart != undefined) {// Si el producto existe en el carrito
        productFoundInCart.quantity = productFoundInCart.quantity + data.products[0].quantity;
        //console.log(data.email)
        await cartFound.save();
        this.io.emit(
          "addedProductToCart",
          JSON.stringify({ error: 200, data:`Ya existe el producto en el carrito ${data.email}, se le sumo la cantidad ${data.products[0].quantity}`})
        );
        console.log(`Ya existe el producto en el carrito ${data.email}, se le sumo la cantidad ${data.products[0].quantity}`)
        return {
          status: 200,
          respuesta: `Ya existe el producto en el carrito ${data.email}, se le sumo la cantidad ${data.products[0].quantity}`
        };
      }

      // Que diferencia hay entre estas 2 lines?
      cartFound.products.push(prod);  
      //await cartModel.updateOne({"email":cartFound.email},cartFound)
      await cartFound.save();

      const productList = await productsModel.findOne({ _id : data.products[0].product })
      this.io.emit(
        "addedProductToCart",
        JSON.stringify({ error: 400, data: `No existe el producto ${productList.title} en el carrito, sera agregado` })
      );
      console.log(`No existe el producto ${productList.title} en el carrito, sera agregado`)
        return {
          status: 200,
          respuesta: `No existe el producto ${productList.title} en el carrito, sera agregado`
        };
    } catch (e) {
      console.log(e);
      console.log("Error al agregar el carrito");
      return {
        status: 400,
        respuesta: "Erro desconocido al agregar el carrito",
      };
    }
  }

  async addCartPid(cid, pid, products) {
    try{

    } catch (e) {
      console.log("Error al agregar el carrito");
      return {
        status: 500,
        respuesta: "Erro desconocido al agregar el carrito",
      };
    }
  }

  async updateCart(cid,products) {
    try {
      console.log(cid)
      console.log(products)
      const cart = await cartModel.findOne({ _id: cid });
      console.log(cart)  // Id del producto a agregar
      if (cart == null) {
        // Si el carrito no existe lo creo
        console.log("no existe el carrito, lo creo");
        const cart = await cartModel.create({ email: data.email });
        //console.log(cart)
      }

      const prod = data.products[0]; // Objeto con el producto a agregar o sumar
      //console.log(prod)
      const cartFound = await cartModel.findOne({ email: data.email }); // Carrito existente
      //console.log(cartFound)

      const productFoundInCart = cartFound.products.find(
        (p) => p.product == data.products[0].product
      );
      console.log(productFoundInCart);

      if (productFoundInCart != undefined) {// Si el producto existe en el carrito
        productFoundInCart.quantity = productFoundInCart.quantity + data.products[0].quantity;
        await cartFound.save();
        console.log(`Al producto ${data.products[0].product} del carrito ${data.email} se le sumo la cantidad ${data.products[0].quantity}`)
        return {
          status: 200,
          respuesta: `Al producto ${data.products[0].product} del carrito ${data.email} se le sumo la cantidad ${data.products[0].quantity}`
        };
      }

      // Que diferencia hay entre estas 2 lines?
      cartFound.products.push(prod);
      //await cartModel.updateOne({"email":cartFound.email},cartFound)
      await cartFound.save();
      console.log(`No existe el producto ${data.products[0].product} en el carrito, sera agregado`)
        return {
          status: 200,
          respuesta: `No existe el producto ${data.products[0].product} en el carrito, sera agregado`
        };
    } catch (e) {
      console.log(e);
      console.log("Error al agregar el carrito");
      return {
        status: 400,
        respuesta: "Erro desconocido al agregar el carrito",
      };
    }
  }

  //Elimina el carrito entero
  async deleteCart(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID");
        return { status: 400, respuesta: "Debe enviar un ID valido" };
      }
      const deletedCart = await cartModel.deleteOne({ _id: id });
      // No funciona esto---------------------- no reconoce otro formato que no sea el de mongo**************
      if (deletedCart.deletedCount != 1) {
        console.log(`El carrito con id: ${id} no existe`);
        return {
          status: 400,
          respuesta: `El carrrito con id: ${id} no existe`,
        };
      }
      console.log(`El carrito con id: ${id} se elimino correctamente`);
      return {
        status: 200,
        respuesta: `El carrito con id: ${id} se elimino correctamente`,
      };
    } catch (e) {
      console.log("Erro desconocido al eliminar el carrito");
      return {
        status: 500,
        respuesta: "Error desconocido al eliminar el carrito",
      };
    }
  }
 
  //Elimina todos los productos del carrito
  async deleteCartProducts(cid) {
    try {
      if (!cid) {
        console.log("Debe enviar un ID");
        return { status: 400, respuesta: "Debe enviar un ID valido" };
      }
      const productsCart = await cartModel.findOne({ _id: cid });
      console.log(productsCart)

      if(productsCart.products == ""){
        console.log(`No hay productos para eliminar en el carrito ${productsCart.email}`);
      return {
        status: 200,
        respuesta: `No hay productos para eliminar en el carrito ${productsCart.email}`,
      };
      }
      // Que diferencia hay entre las siguientes 2 lineas
      //await cartModel.updateOne({ _id: cid }, productsCart ); 
      productsCart.products = [];
      await productsCart.save() 
      console.log(`Se eliminaron todos los productos del carrito ${productsCart.email}`);
      return {
        status: 200,
        respuesta: `Se eliminaron todos los productos del carrito ${productsCart.email}`,
      };
    } catch (e) {
      console.log("Erro desconocido al eliminar el carrito");
      return {
        status: 500,
        respuesta: "Error desconocido al eliminar el carrito",
      };
    }
  }

  async deleteCartProduct(cid,pid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      console.log(cart)
      const productExist = cart.products.filter((p)=> p.product != pid)
      //console.log(productExist)
      await cartModel.updateOne({ _id: cid},{ products: productExist})
      console.log(`Se elimino el producto ${pid} del carrito ${cart.email}`)
      return {
        status: 200,
        respuesta: `Se elimino el producto ${pid} del carrito ${cart.email}`,
      };
    } catch (e) {
      console.log("Erro desconocido al eliminar el carrito");
      return {
        status: 500,
        respuesta: "Error desconocido al eliminar el carrito",
      };
    }
  }
}

module.exports = {
  CartManager,
};
