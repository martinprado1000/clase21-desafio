//const fs = require("fs");
const session = require("express-session");
const userModel = require("../models/userModel");
const { hashPassword } = require("../utils/passwordHash");
const passport = require("passport");

const initializePassport = require("../config/passportConfig")

class UserManagerDb {
  constructor(io) {
    this.io = io;
  }

  async getUser(email) {
    try {
      const user = await userModel.findOne({ email: email });
      return user;
    } catch (e) {
      console.log("Error al leer la db");
      return { status: 500, data: "Error al leer la db" };
    }
  }

  async createUser(data) {
    try {
      //console.log(data.password)
      const exist = await this.getUser(data.email);
      data.password = hashPassword(data.password); // Llamamos a nustra funcion para hashear la password
      //console.log(data.password)
      if (exist == null) {
        const user = await userModel.create(data);
        console.log(user);
        console.log(`Usuario ${data.email} creado correctamente`);
        return {
          status: 200,
          data: `Usuario ${data.email} creado correctamente`,
        };
      }
      return {
        status: 400,
        data: `El Usuario ${data.email} ya existe`,
      };
    } catch (e) {
      console.log("Error al leer la db");
      this.io.emit(
        "errorRegister",
        JSON.stringify({ error: 400, data: "Error al leer la db" })
      );
      return;
    }
  }

  async recoveryPassword(data) {
    // Con este metodo creo 100 productos
    try {
      console.log(data);
      const newPassword = hashPassword(data.password);
      console.log(newPassword)
      await userModel.updateOne( { email: data.email } , { password:newPassword }
      );
      console.log( `Usuario ${data.email}, cambio la contraseña satisfactiriamente`);
      return {
        status: 200,
        data: `Usuario ${data.email}, cambio la contraseña satisfactiriamente`,
      };
    } catch (e) {
      console.log("Error al leer la db");
      return { status: 500, data: "Error al leer la db" };
    }
  }

  // async getProductsPaginate(data) {
  //   // ?limit=2&page=2&query=fruta&sort=asc  // esto podemos recibir en la consulta
  //   const limit = parseInt(data.limit) || 10;
  //   const page = parseInt(data.page) || 1;
  //   const category = data.query || "";
  //   const sort = parseInt(data.sort) == "desc" ? -1 : 1 || "";
  //   //const sort = parseInt(data.sort) || " ";
  //   const options = {limit,page,category,sort}
  //   console.log(options)
  //   let query = {}; // Define un objeto vacío para la consulta
  //   if (category) {
  //       query.category = category; // Agrega la categoría a la consulta si se proporciona
  //   }
  //   try {
  //     const products = await productModel.paginate(query,{ limit , page , sort:{price:sort} })
  //     //console.log(products.docs)
  //     const pDocs = products.docs

  //     const payload = await pDocs.map((p)=>p.toObject());
  //     // paguinate me retorna un objeto que contiene toda la info de paguinacion y un array llamado docs que ahi se encuentran los datos solicitados.
  //     //console.log(payload)
  //     const productsPaginate = {
  //       status: "success",
  //       payload,
  //       totalPages: products.totalPages,
  //       prevPage: products.prevPage,
  //       nextPage: products.nextPage,
  //       page: products.page,
  //       hasPrevPage: products.hasPrevPage,
  //       hasNextPage: products.hasNextPage,
  //       prevLink: products.hasPrevPage == true ? `http://localhost:8080/realTimeProducts/?page=${products.prevPage}` : null,
  //       nextLink: products.hasNextPage == true ? `http://localhost:8080/realTimeProducts/?page=${products.nextPage}` : null,
  //     };
  //     // paguinate me retorna un objeto que contiene toda la info de paguinacion y un array llamado docs que ahi se encuentran los datos solicitados.
  //       return { status: 200, data: productsPaginate };
  //   } catch (e) {
  //     console.log("Error al leer la base de datos");
  //     return { status: 500, data: "Error al leer la base de datos" };
  //   }
  // }

  // async getProductById(id) {
  //   try {
  //     if (!id) {
  //       console.log("Debe enviar un ID valido");
  //       return { status: 400, data: "Debe enviar un ID valido" };
  //     }
  //     const productId = await productModel.findById(id);
  //     return { status: 200, data: productId };
  //     //return pId ;
  //   } catch (e) {
  //     console.log("Error al leer la base de datos");
  //     return { status: 500, data: "Error al leer la base de datos" };
  //   }
  // }

  // async getProductByCode(code) {
  //   try {
  //     if (!code) {
  //       console.log("Debe enviar un codigo valido");
  //       return { status: 400, data: "Debe enviar un codigo valido" };
  //     }
  //     const productCode = await productModel.find({ code: code });
  //     return { status: 200, data: productCode };
  //     //return pId ;
  //   } catch (e) {
  //     console.log("Error al leer la base de datos");
  //     return { status: 500, data: "Error al leer la base de datos" };
  //   }
  // }

  // async deleteProduct(id) {
  //   console.log(id);
  //   try {
  //     if (!id) {
  //       console.log("Debe enviar un ID");
  //       this.io.emit(
  //         "error",
  //         JSON.stringify({ error: 400, data: "Debe enviar un ID" })
  //       );
  //       return;
  //     }
  //     const prodDelete = await productModel.deleteOne({ _id: id });
  //     if (prodDelete.deletedCount != 1) {
  //       console.log(`El producto con id ${id} no existe`);
  //       this.io.emit(
  //         "error",
  //         JSON.stringify({
  //           error: 400,
  //           data: `El producto con id ${id} no existe`,
  //         })
  //       );
  //       return;
  //     }
  //     console.log(`El producto se elimino correctamente`);
  //     this.io.emit(
  //       "deleteProduct",
  //       JSON.stringify({
  //         error: 200,
  //         data: `El producto se elimino correctamente`,
  //       })
  //     );
  //     return;
  //   } catch (e) {
  //     console.log("Erro al eliminar el producto");
  //     this.io.emit(
  //       "error",
  //       JSON.stringify({ error: 400, data: `Error al eliminar el producto` })
  //     );
  //   }
  // }

  // async addProduct({
  //   title,
  //   description,
  //   price,
  //   thumbnail,
  //   code,
  //   stock,
  //   category,
  // }) {
  //   try {
  //     if (!title || !description || !price || !code || !stock || !category) {
  //       console.log("Campos incompletos");
  //       this.io.emit(
  //         "error",
  //         JSON.stringify({ error: 400, data: "Campos incompletos" })
  //       );
  //       return  { status: 200, data: "Campos incompletos" };
  //     }
  //     const productCode = await this.getProductByCode(code);
  //     //console.log(productCode)
  //     if (productCode.data.length == 0) {
  //       const newProduct = {
  //         title,
  //         description,
  //         price,
  //         thumbnail: thumbnail || [],
  //         code,
  //         stock,
  //         category,
  //       };
  //       const newProductInserted = await productModel.create(newProduct);
  //       console.log(`Producto con codigo ${code} agregado correctamente`);
  //       this.io.emit("newProduct", JSON.stringify(newProductInserted));
  //       return  { status: 200, data: newProductInserted };
  //     }
  //     console.log("El codigo de producto ya existe");
  //     this.io.emit("error", JSON.stringify({
  //         error: 400,
  //         data: `El codigo de producto ${code} ya existe`,
  //       })
  //     );
  //     return  { status: 200, data: `El codigo de producto ${code} ya existe` };
  //   } catch (e) {
  //     console.log("Erro desconocido al agregar el producto");
  //     return {
  //       status: 500,
  //       data: "Erro desconocido al agregar el producto",
  //     };
  //   }
  // }

  // async updateProduct(
  //   id,
  //   { title, description, price, thumbnail, code, stock, category }
  // ) {
  //   try {
  //     console.log(id);
  //     if (
  //       !title ||
  //       !description ||
  //       !price ||
  //       !thumbnail ||
  //       !code ||
  //       !stock ||
  //       !category
  //     ) {
  //       console.log("Campos incompletos");
  //       this.io.emit(
  //         "error",
  //         JSON.stringify({ error: 400, data: "Campos incompletos" })
  //       );
  //       return;
  //     }
  //     const productCode = await this.getProductByCode(code);
  //     if (productCode.data.length != 0) {
  //       // Existe entonces lo edito
  //       console.log("existe entonces lo edito");
  //       const editProduct = {
  //         title: title || productId.title,
  //         description: description || productId.description,
  //         price: price || productId.price,
  //         thumbnail: thumbnail || productId.thumbnail,
  //         code: code || productId.code,
  //         stock: stock || productId.stock,
  //         category: category || productId.category,
  //       };
  //       await productModel.updateOne({ _id: id }, editProduct);
  //       console.log(`El producto con codigo: ${code} se edito correctamente`);
  //       this.io.emit(
  //         "editProduct",
  //         JSON.stringify({
  //           error: 200,
  //           data: `El producto con codigo: ${code} se edito correctamente`,
  //         })
  //       );
  //       return;
  //     }
  //     console.log("El codigo de producto NO existe o esta duplicado");
  //     this.io.emit(
  //       "error",
  //       JSON.stringify({
  //         error: 400,
  //         data: `El codigo de producto ${code} no existe o esta duplicado`,
  //       })
  //     );
  //     return;
  //   } catch (e) {
  //     this.io.emit(
  //       "error",
  //       JSON.stringify({
  //         error: 500,
  //         data: `Erro desconocido al editar el producto`,
  //       })
  //     );
  //     return { status: 500, data: "Erro desconocido al editar el producto" };
  //   }
  // }
}

module.exports = { UserManagerDb };
