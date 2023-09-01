const { Router } = require ("express")

const viewChatRoutesFn = ((io)=>{
    
    const pagesFn = require("../controllers/chatViewControllers")

    const {  chatLogin, chatLoginPost, chat } = pagesFn(io) 
    
    const router = Router();
    
    router.get("/chat.handlebars", chatLogin);

    router.post("/chat.handlebars", chatLoginPost);

    router.get("/chat.handlebars/messages", chat);

    return router;
    
})


module.exports = viewChatRoutesFn ;
