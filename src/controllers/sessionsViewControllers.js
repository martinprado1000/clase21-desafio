const { UserManagerDb } = require("../dao/userManagerDb");

const pagesFn = (io) => {
  const manager = new UserManagerDb(io);

  const register = async (req, res) => {
    const error = req.flash('error')[0] // Recordar que flash solo se muestra la primera vez, si hago un clg anteriar luevo el req.flash ya no existe.
    console.log(error)
    return res.render('register',{error,hasError:error!==undefined})
    
  };

  const login = async (req, res) => {
    const error = req.flash('error')[0]; // Recordar que flash solo se muestra la primera vez, si hago un clg anteriar luevo el req.flash ya no existe.
    console.log(error)
    return res.render('login',{error,hasError:error!==undefined})
    // const error = req.flash('error')[0]
    // console.log(error)
    // return res.render('login',{error,hasError:error!==undefined});
  };

  const recoveryPassword = async (req, res) => {
    res.render("recoveryPassword.handlebars");
  };

  return {
    register,
    login,
    recoveryPassword
  };
};

module.exports = pagesFn;
