// Toda esta conexion la podemos meter dentro de una funcion async/await para en el caso de que falle no se rompa la aplicacion.

const mongoose = require("mongoose");

//no funciona poniendo localhost en vez de 127.0.0.1.
const uri = "mongodb://127.0.0.1:27017/ecommers"; // guardamos en la variable uri la direccion y el nombre de la bd, mondodb: es para decirle que la db es mongo
// SI LA BASE NO EXISTE LA CREA
const db = mongoose.connection; // Guardamos la escucha de eventos en una variable

mongoose.connect(uri, { // Le indico a mongoose se conecte a la siguiente direccion:  a la variable uri en este caso.
  useNewUrlParser: true,  // Estas 2 lineas son configuraciones de conexion.
  useUnifiedTopology: true,
});

// Eventos en relacion a la coneccion:

// on es para escuchar los eventos en relacion a la conexion
// escuchamos el evento open ( open: Cuando se establece la conexion)
// _ : significa que no retorna nada este evento
// once: este evento una vez que se ejecuta luego va a ser ignorado
db.once("open", _ => {
  console.log("Sistema conectado a la base", uri); // Cuando se establece la coneccion ejecuto esto
});

// on: este evento se ejecucha siempre que eschucha el evento
db.on("error", (err) => {
  // Escuchamos el evento error y recibimos lo que retorna este evento en err
  console.log("Error al conectar con la base Local"); // Cuando se establece la coneccion ejecuto esto
  process.exit()  // Termina la aplicacion.
});


