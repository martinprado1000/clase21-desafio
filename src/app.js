const express = require("express");
const app = express();
const connectionFn = require("./connection");
const uri = "mongodb+srv://martinprado1000:petete2000@cluster0.kbl1ng2.mongodb.net/ecommerce?retryWrites=true&w=majority";
connectionFn(uri);
//require("./connectionLocal");
const handlebars = require("express-handlebars");
const ioFn = require("./utils/io.js");
const cookieParser = require("cookie-parser"); // Requerimos cookie-parse
const MongoStore = require("connect-mongo");
const passport = require("passport");
const initializePassport = require("./config/passportConfig.js")
const flash = require("connect-flash")

const sessionRoutesFn = require("./routes/sessionRoutes.js");
const productsRoutesFn = require("./routes/productsRoutes.js");
const cartsRoutesFn = require("./routes/cartsRoutes.js");
const viewSessionRoutesFn = require("./routes/viewSessionRoutes.js");
const viewProductsRoutesFn = require("./routes/viewProductsRoutes.js");
const viewCartsRoutesFn = require("./routes/viewCartsRoutes.js");
const viewChatRoutesFn = require("./routes/viewChatRoutes.js");

app.engine("handlebars", handlebars.engine());
app.set("views", "./views");
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(flash())

const session = require("express-session") 
// Middleware de sessionon
app.use(cookieParser("estaEsMiLlaveSecreta"));

// Middleware de session
app.use(
  session({
    store: MongoStore.create({
      // MongoStore.create, crea una session en la db de mongo
      mongoUrl: uri, // Le indicamos que db crear la session
      ttl: 120, // time to live; tiempo de vida, esta en SEGUNDOS.
      //retrien: 0                 // Cantidad de reintentos que hace para leer el archivo de ssesion
    }),
    secret: "estaEsMiLlaveSecreta",
    resave: true, // Si esta opcion la ponemos en false es para que la sesion se mantenga activa en caso de inactividad.
    saveUninitialized: true, // Permite guardar la sesion aunque el objeto de session no tenga nada.
  })
);

const PORT = 8080;
const httpServer = app.listen(PORT, () =>
  console.log(`Servidor express corriendo en el puerto ${PORT}`)
); // Al server de express lo guardamos en una variable

const io = ioFn(httpServer); // Ejecuto la funcion que crea el server socket.io y le passamos el server httpServer como parametro.

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const sessionRoutes = sessionRoutesFn(io);
const productsRoutes = productsRoutesFn(io);
const cartsRoutes = cartsRoutesFn(io);
const viewSessionRoutes = viewSessionRoutesFn(io);
const viewProductsRoutes = viewProductsRoutesFn(io);
const viewCartsRoutes = viewCartsRoutesFn(io);
const viewChatRoutes = viewChatRoutesFn(io);

app.use("/api/", sessionRoutes);
app.use("/api/", productsRoutes);
app.use("/api/", cartsRoutes);
app.use("/", viewSessionRoutes);
app.use("/", viewProductsRoutes);
app.use("/", viewCartsRoutes);
app.use("/", viewChatRoutes);

//Ruta incorrecta
app.use((req, res) => {
  res.status(404).send({ Error: "La ruta deseada no existe" });
});
