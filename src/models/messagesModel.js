const { Schema, model } = require("mongoose"); // de mongoose solo requier Schemay model
// Schema: es para armar el esquema de como va a ser nuestra colleccion, se escribe en mayusculo porque es una clase.
// model: es lo que interactua nuestro esquema con la colleccion

//Los tipo de datos los obtenemos d la paguina de mongoose
const chatSchema = new Schema(
  {
    email: String,
    message: String,
  },
  { timestamps: true }
);

module.exports = model("messages", chatSchema);
// Si no existe crea el nombre de la colleccion cuando ingresemos el primer producto
// Aca indicamos que el nombre de nuestro modelo es Product y esta basado en el Schema productSchema.
// Y lo exporto para usar en otro lado de la aplicacion
