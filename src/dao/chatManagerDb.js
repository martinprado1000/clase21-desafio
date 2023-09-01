const fs = require("fs");
const messagesModel = require("../models/messagesModel");

class ChatManager {
  constructor(io) {
    this.io = io;
  }

  async getUsers() {
    try {
      const users = await messagesModel.find()
      console.log(users.email)
      return
      
      //return cartModel.find();
    } catch (e) {
      console.log("Error al leer el archivo Carts");
      return {
        status: 500,
        respuesta: "Error desconocido al leer el archivo Carts",
      };
    }
  }

  async postUserLogin(data) {
    try {
      console.log(data)
      //console.log(this.io)
      const newMessages = JSON.stringify(data)
      //await messagesModel.create(data)
      this.io.emit("newMessage", newMessages)
      return
    } catch (e) {
      console.log("Error al leer el archivo Carts");
      return {
        status: 500,
        respuesta: "Error desconocido al leer el archivo Carts",
      };
    }
  }

  async getMessages() {
    try {
      //let carts = await fs.promises.readFile(this.path, "utf-8");
      //const cartsObj = await JSON.parse(carts);
      //return cartModel.find();
    } catch (e) {
      console.log("Error al leer el archivo Carts");
      return {
        status: 500,
        respuesta: "Error desconocido al leer el archivo Carts",
      };
    }
  }

  async postMessages(data) {
    try {
      
      return
    } catch (e) {
      console.log("Error al leer el archivo Carts");
      return {
        status: 500,
        respuesta: "Error desconocido al leer el archivo Carts",
      };
    }
  }

}

module.exports = {
  ChatManager,
};
