const { Schema, model } = require("mongoose") // de mongoose solo requier Schemay model
// Schema: es para armar el esquema de como va a ser nuestra colleccion, se escribe en mayusculo porque es una clase.
// model: es lo que interactua nuestro esquema con la colleccion

const userSchema = new Schema ({
    name: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
    },
    username: String,
    age: Number,
    password: String,
    rol: {
        type: String,
        default: "user",
        enum: ["admin", "user"]
    }
      
})

/** 
// Asi seria el tipo de objeto que le tengo que pasar a este Model.
{
  name: 'martin',
  lastname: 'prado',
  age: '22',
  email: 'asd@gmail.com',
  password: '12345'
}

**/

module.exports = model("users" , userSchema)
