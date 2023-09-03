const passport = require("passport");
const passportLocal = require("passport-local");
const userModel = require("../models/userModel");
const { hashPassword, isValidPassword } = require("../utils/passwordHash");
const GitHubStrategy = require("passport-github2")

const LocalStrategy = passportLocal.Strategy;

const initializePassport = () => {
  
  passport.use( // El primer parametro es un string, seria el nombre del passport. Y el segundo es una instacia
    "register", // Nombre del passport
    new LocalStrategy( // Instanciamos el passport, el primer parametro es un objeto y el segundo es una fincion
      { passReqToCallback: true, usernameField: "email" }, // Si no le indicamos el email toma por default el nombre si tiene.
      async (req, username, password, done) => {
        // El username siermpre hace referencia al email porque lo definimos en la linea de arriba.
        try {
          const exist = await userModel.findOne({ email: username }); // Aca le decimos que el email tiene que ser igual a username porque en la linea anterior le indicamos que como nombre usamos el email

          if (exist == null) {
            const body = req.body;
            body.password = hashPassword(body.password); // Llamamos a nustra funcion para hashear la password
            let user = await userModel.create(body);
            console.log(user);
            console.log(`Usuario ${username} creado correctamente`);
            return done(null, user);
          }

          console.log(`El usuario ${username} ya existe`);
          return done(null, false, {message:`El usuario ${username} ya existe`});
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
            console.log(`Usuario es invalido`);
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
          return done(null,user)
          } catch (e) {
          console.log("Error al leer la db");
          return done(e);
        }
      }
    )
  );

  passport.use("github", new GitHubStrategy( 
    { 
      clientID:"Iv1.60312c44dbb83c65",
      clientSecret:"103d6a1e8d8691c19f60cd265dbd13625bf19e86",
      callbackURL:"http://localhost:8080/api/loginGithub-callback"
    }, 
    async (accessToken, refreshToken, profile, done) => { //accessToken: se usa para leer datos de la aplicacion de git, refreshToken: es para actualizar el token despues del tiempo de vida, profile: viene la informacion de github.
      try {
        console.log(profile) // Aca viene la info que nos trae github
        let user = await userModel.findOne({username:profile.username}) // hago el registro con username porq github no me retorna el email
        console.log(user)
        if(user){
          console.log(`El usuario ${profile.username} ya existe`)
          return done(null,user)
        }

        console.log(`El usuario ${profile.username} no existe`)
        newUser = {
          username : profile.username,
          name : profile._json.name
        }
        await userModel.create(newUser)
        return done(null,newUser)
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
