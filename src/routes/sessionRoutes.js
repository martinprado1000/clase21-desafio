const { Router } = require("express");
const passport = require("passport")

const sessionRoutesFn = ((io)=>{

  const pagesFn = require("../controllers/sessionsControllers")

  const { register, loginPost, registerPost, registerDelete, resetPassword } = pagesFn(io)  

const router = Router();

  router.get("/", register); 

  router.post("/register", passport.authenticate('register',{failureRedirect:'/register' , failureFlash: true}), registerPost); // Inyectamos passport como un middleware.
  
  router.post("/login", passport.authenticate('login',{failureRedirect:'/login' , failureFlash: true}), loginPost); 

  router.get("/loginGithub", passport.authenticate('github',{scope:['user:email']}), async(req,res)=>{});  // Aca hace la redireccion a github para que nos loguiemos, y luego le envia la ingormasion de loguea a la direccion de callback que cargamos en github
  // scope:['user:email'] Es el dato que queremos obtener de git
  router.get("/loginGithub-callback", passport.authenticate('github',{failureRedirect:'/login'}), async(req,res)=>{ // Y aca es donde github envia los datos que obtubimos en la strategy github
    console.log(req.user)
    res.redirect("/realTimeProducts")
  });

  router.delete("/register", registerDelete);

  router.post("/resetPassword", resetPassword);

  return router;

})


module.exports = sessionRoutesFn ;
