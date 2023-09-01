const { Server } = require("socket.io"); //  npm i socket.io  1-Requerimos socket.io, requerimos Server destructurado.

//** lo que hago con esta funcion es crear el server socket.io, desde app.js recivo como parametro el servidor httpServer de express, */
//** para poder usarlo aca y crear el server socket.io */
const { UserManagerDb } = require("../dao/userManagerDb");
const { ProductManagerDb } = require("../dao/productManagerDb");
const { ChatManager } = require("../dao/chatManagerDb");
const { CartManager } = require("../dao/cartManagerDb");

const ioFn = (httpServer) => {
  const io = new Server(httpServer);
  const userManager = new UserManagerDb(io);
  const productManager = new ProductManagerDb(io);
  const chatManager = new ChatManager(io);
  const cartManager = new CartManager(io);
  io.on("connection", (socket) => {
    console.log("Nuevo cliente conectado");

    //----------------PRODUCTS--------------------------------------
    socket.on("newProduct", async (data) => {
      //console.log(data);
      productManager.addProduct(data);
    });

    socket.on("editProduct", async (data) => {
      //console.log(data)
      const product = JSON.parse(data);
      productManager.updateProduct(product.id, product);
    });

    socket.on("deleteProduct", async (data) => {
      productManager.deleteProduct(data);
    });

    socket.on("getProductById", async (data) => {
      const id = JSON.parse(data);
      const res = await productManager.getProductById(id);
      socket.emit("getProductById", JSON.stringify(res));
    });

    //-------------------CHAT---------------------------------------------
    socket.on("newUser", async (data) => {
      const newUser = JSON.parse(data);
      chatManager.postUserLogin(newUser);
      console.log(newUser);
      socket.broadcast.emit("joinUser", JSON.stringify(newUser));
      socket.emit("redirect", JSON.stringify(newUser));
    });

    socket.on("newMessage", async (data) => {
      const newMessage = JSON.parse(data);
      console.log(newMessage);
      chatManager.postUserLogin(newMessage);
      //socket.emit("newMessage",JSON.stringify(newMessage)) // Si lo hago desde aca no funciona para enviarlo a todos los sockets
    });

    //-------------------REGISTER----------------------------------------------
    socket.on("regiterUser", async (data) => { 
      //console.log(data);
      const response = await userManager.createUser(data);
    });

    // //-------------------LOGIN----------------------------------------------
    // socket.on("loginUser", async (data) => {
    //   console.log(data);
    //   const response = await userManager.getUser(data.email);
    //   if (response == null) {
    //     console.log(`El usuario ${data.email} no existe`);
    //     socket.emit(
    //       "errorLogin",
    //       JSON.stringify({ error: 400, data: "Usuario o contraseña invalido" })
    //     );
    //     return;
    //   } 
    //   if(data.password != response.password){
    //     console.log(`Contraseña invalida`);
    //     socket.emit(
    //       "errorLogin",
    //       JSON.stringify({ error: 400, data: "Usuario o contraseña invalido" })
    //     );
    //     return;
    //   }
      
    //     console.log(`${data.email} a iniciado sesion`);
    //     socket.emit(
    //       "loginUser",
    //       JSON.stringify({ error: 200, data: `${data.email} bienvenido` })
    //     );
    // });

    // socket.emit("loginUser", async (data) => {
    //   console.log(data);
    //   const response = await userManager.getUser(data.email);
    //   if (response == null) {
    //     console.log(`El usuario ${data.email} no existe`);
    //     socket.emit(
    //       "errorLogin",
    //       JSON.stringify({ error: 400, data: "Usuario o contraseña invalido" })
    //     );
    //   }
    // });
  });

  return io;
};

module.exports = ioFn;
