const { ChatManager } = require("../dao/chatManagerDb");

const pagesFn = (io) => {
//instacio el Cartmanager
//const manager = new CartManager("db/carts.json");
const manager = new ChatManager(io);

const chatLogin = async (req, res) => {
  try {
    return res.render("chat.handlebars")

  } catch (e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

const chatLoginPost = async (req, res) => {
    try { 
      const userEmail = req.body;
      console.log(userEmail.email)
      await manager.postUserLogin(userEmail)
      return res.redirect(`/chat.handlebars/messages?user=${userEmail.email}`) 

    } catch (e) {
      console.log(e);
      return { "Error" : "Algo salio mal con la consulta"}
    }
  }

//get ProductById
const chat = async (req, res) => {
  try{
    return res.render("chat.messages.handlebars")
    
  } catch(e) {
    console.log(e);
    return { "Error" : "Algo salio mal con la consulta"}
  }
}

// //post Product
// const cartAdd = async (req, res) => {
//   try{
//     const data = req.body;
//     const result = await manager.addCart(data);
//     res.status(result.status).send(result.respuesta);
//   } catch(e) {
//     console.log(e);
//     return { "Error" : "Algo salio mal con la consulta"}
//   }
// }

// //post Product pid
// const cartAddPid = async (req, res) => {
//   try{
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const data = req.body;
//     const result = await manager.addCartPid(cid,pid,data);
//     res.status(result.status).send(result.respuesta);
//   } catch(e) {
//     console.log(e);
//     return { "Error" : "Algo salio mal con la consulta"}
//   }
// }

//put Product
// const cartPut = async (req, res) => {
//   try{
//     const pid = req.params.pid;
//     const cart = req.body;
//     const data = await manager.updateCart(pid,cart);
//     res.status(data.status).send(data.respuesta);
//   } catch(e) {
//     console.log(e);
//     return { "Error" : "Algo salio mal con la consulta"}
//   }
// }

// //delete Product
// const cartDelete = async (req, res) => {
//   try{
//     const cart = req.params.pid;
//     const data = await manager.deleteCart(cart);
//     res.status(data.status).send(data.respuesta);
//   } catch(e) {
//     console.log(e);
//     return { "Error" : "Algo salio mal con la consulta"}
//   }
// }
return {
    chatLogin,
    chatLoginPost,
    chat
  };
};

module.exports = pagesFn;