const { UserManagerDb } = require("../dao/userManagerDb");

const pagesFn = (io) => {
  const manager = new UserManagerDb(io);

  const register = async (req, res) => {
      res.render("register");
    
  };

  const login = async (req, res) => { 
    return res.render('login')
    // const error = req.flash('error')[0]
    // console.log(error)
    // return res.render("login",{error,hasError:error!==undefined});
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
