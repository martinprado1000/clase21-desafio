const { Router } = require("express");

const viewSessionRoutesFn = (io) => {
  const pagesFn = require("../controllers/sessionsViewControllers");

  const { register, login, recoveryPassword } = pagesFn(io);

  const router = Router();

  const sessionMiddleware = (req, res, next) => {  // Creo el middleware para usar en las siguientes 2 rutas
    if (req.session.email) {
      res.redirect("/realTimeProducts");
    }
    return next();
  };

  router.get("/register", sessionMiddleware, register); // // Aca le agregue el middleware para que si ya a iniciado session no pueda ir a la paginoa de register

  router.get("/login", sessionMiddleware, login); // Aca le agregue el middleware para que si ya a iniciado session no pueda ir a la paginoa de login

  router.get("/recovery-password", recoveryPassword);

  return router;
};

module.exports = viewSessionRoutesFn;
