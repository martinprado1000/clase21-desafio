const passport = require("passport");
const passportLocal = require("passport-local");
const userModel = require("../models/userModel");
const { hashPassword, isValidPassword } = require("../utils/passwordHash");
const flash = require("connect-flash")

const LocalStrategy = passportLocal.Strategy;

const initializePassport = () => {
  
  passport.use(
    // El primer parametro es un string, seria el nombre del passport. Y el segundo es una instacia
    "register", // Nombre del passport
    new LocalStrategy( // Instanciamos el passport, el primer parametro es un objeto y el segundo es una fincion
      { passReqToCallback: true, usernameField: "email" }, // Si no le indicamos el email toma por default el nombre si tiene.
      async (req, username, password, done) => {
        // El username siermpre hace referencia al email porque lo definimos en la linea de arriba.
        try {
          const exist = await userModel.findOne({ email: username }); // Aca le decimos que el email tiene que ser igual a username porque en la linea anterior le indicamos que como nombre usamos el email

          //console.log(data.password)
          if (exist == null) {
            const body = req.body;
            body.password = hashPassword(body.password); // Llamamos a nustra funcion para hashear la password
            const user = await userModel.create(body);
            console.log(user);
            console.log(`Usuario ${username} creado correctamente`);
            return done(null, user);
          }

          console.log(`El usuario ${username} ya existe`);
          return done(null, false, {message:`El usuario ya existe`});
        } catch (e) {
          console.log("Error al leer la db");
          return done(e);
        }
      }
    )
  );

  passport.use("login", new LocalStrategy( 
      { usernameField: "email" }, 
      async (username, password, done) => {
        try {
          let user = await userModel.findOne({email:username});
          if (user == null) {
            console.log(`El usuario es invalido`);
            return done(null,false,{message:`Datos incorrectos`})
          }
          //console.log(isValidPassword(data.password,user.password)) // Aca comparo la password que me pasaron con la password hasheada, esto me retorna true o false.
          if (!isValidPassword(password, user.password)) {
            // Chequeo si las password hacen match pero antes paso la password por nuestra funcion de hash para poder comprarlas.
            console.log(`Contraseña invalida`);
            return done(null,false,{message:`Contraseña invalida`})
          }
          console.log(`${user.email} a iniciado sesion`);
          user = user.toObject(); // Conbierto la respuesta de mongo a objeto para poder borrar el password y que no quede en el backend
          delete user.password; // Borro la contraseña para que no quede en el backend
          // if (user.rol == "admin") {
          //   res.json({  
          //     status: 200,
          //     data: `Usuario admin: ${user.email} a iniciado sesion`,
          //   });  
          // } else {
          //   res.json({ status: 200, data: `${user.email} a iniciado sesion` });
          // }
          return done(null,user)
          } catch (e) {
          console.log("Error al leer la db");
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findOne({ _id:id });
    done(null, user);
  });

};

module.exports = initializePassport;
