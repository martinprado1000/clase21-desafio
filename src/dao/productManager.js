const fs = require("fs");

class ProductManager {
  constructor(path, io) {
    this.path = path;
    this.io = io;
    //console.log(path)
    //console.log(io)
    const ex = async () => {
      try {
        await fs.promises.access(this.path);
      } catch (e) {
        console.log("El archivo Products no existe");
        const arr = JSON.stringify([]);
        fs.promises.writeFile(path, arr);
        console.log("Archivo Products creado correctamente");
      }
    };
    ex();
  }

  async getProducts() {
    try {
      let products = await fs.promises.readFile(this.path, "utf-8");
      const productsObj = await JSON.parse(products);
      return productsObj;
    } catch (e) {
      console.log("Error al leer el archivo Products");
      return { status: 500, respuesta: "Error al leer el archivo Products" };
    }
  }

  async getProductById(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID valido");
        return { status: 400, respuesta: "Debe enviar un ID valido" };
      }
      const productos = await this.getProducts();
      const exist = productos.findIndex((ex) => ex.id == id);
      if (exist === -1)
        return {
          status: 400,
          respuesta: `El producto con id ${id} no existe`,
        };
      const prodId = productos.find((p) => p.id == id);
      return { status: 200, respuesta: prodId };
    } catch (e) {
      console.log("Error al leer el archivo");
      return { status: 500, respuesta: "Error al leer el archivo Products" };
    }
  }

  async deleteProduct(id) {
    try {
      if (!id) {
        console.log("Debe enviar un ID");
        return { status: 400, respuesta: "Debe enviar un ID valido" };
      }
      const prod = await this.getProducts();
      const exist = prod.findIndex((ex) => ex.id == id);
      if (exist === -1) {
        console.log(`El producto con id ${id} no existe`);
        return {
          status: 400,
          respuesta: `El producto con id ${id} no existe`,
        };
      }
      const prodDelete = prod.filter((p) => p.id != id);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(prodDelete, null, 2)
      );
      console.log(`El producto con id ${id} se elimino correctamente`);
      return {
        status: 204,
        respuesta: `El producto con id ${id} se elimino correctamente`,
      };
    } catch (e) {
      console.log("Erro al eliminar el producto");
      return { status: 500, respuesta: "Error al eliminar el producto" };
    }
  }

  async addProduct({
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
  }) {
    try {
      // if (!title || !description || !price || !code || !stock || !category) {
      //   console.log("Campos incompletos");
      //   return { status: 400, respuesta: "Campos incompletos" };
      // }
      const produ = await this.getProducts();
      const newProduct = {
        id: produ.length + 1,
        title,
        description,
        price,
        thumbnail: thumbnail || [],
        code,
        stock,
        category,
      };
      //console.log(newProduct)
      produ.push(newProduct);
      this.io.emit("nuevoProducto", JSON.stringify(newProduct)); // Ejecuto io.emit para pasarle al front el nuevo producto. Recordar que esto siempre envia string por eso usamos el JSON.stryngify
      await fs.promises.writeFile(this.path, JSON.stringify(produ, null, 2));
      console.log("Producto agregado correctamente");
      return { status: 201, respuesta: "Producto agregado correctamente" };
      //return produ
    } catch (e) {
      console.log("Erro al agregar el producto");
      return { status: 500, respuesta: "Erro al agregar el producto" };
    }
  }

  async updateProduct(
    id,
    { title, description, price, thumbnail, code, stock, category }
  ) {
    try {
      const pid = parseInt(id);
      const prod = await this.getProducts();
      const productIndex = prod.findIndex((product) => product.id === pid);
      if (productIndex === -1) {
        console.log(`El producto con id ${id} no existe`);
        return {
          status: 400,
          respuesta: `El producto con id ${id} no existe`,
        };
      }
      prod[productIndex].title = title || prod[productIndex].title;
      prod[productIndex].description = description || prod[productIndex].description;
      prod[productIndex].price = price || prod[productIndex].price;
      prod[productIndex].thumbnail = thumbnail || prod[productIndex].thumbnail;
      prod[productIndex].code = code || prod[productIndex].code;
      prod[productIndex].stock = stock || prod[productIndex].stock;
      prod[productIndex].category = category || prod[productIndex].category;
      prod[productIndex].status = prod[productIndex].status;

      await fs.promises.writeFile(this.path, JSON.stringify(prod, null, 2));
      console.log(`El producto con id: ${pid} se edito correctamente`);
      return {
        status: 201,
        respuesta: `El producto con id ${pid} se edito correctamente`,
      };
    } catch (e) {
      return { status: 500, respuesta: "Erro al editar el producto" };
    }
  }
}

module.exports = { ProductManager };
