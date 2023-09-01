const { Router } = require("express");
const passport = require("passport")
const flash = require("connect-flash")

const sessionRoutesFn = ((io)=>{

  const pagesFn = require("../controllers/sessionsControllers")

  const { register, loginPost, registerPost, registerDelete, resetPassword } = pagesFn(io)  

const router = Router();

  router.get("/", register); 

  router.post("/register",  passport.authenticate('register',{failureRedirect:'/register' , failureFlash: true}), registerPost); // Inyectamos passport como un middleware.
  
  router.post("/login", passport.authenticate('login',{failureRedirect:'/login' , failureFlash: true}), loginPost);

  router.delete("/register", registerDelete);

  router.post("/resetPassword", resetPassword);

  return router;

})


module.exports = sessionRoutesFn ;
