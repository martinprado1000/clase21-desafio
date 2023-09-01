const bcrypt = require("bcrypt")

const hashPassword = ((password)=>{  // Con la siguiente funsion hasheamos la password que le pasamos.
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) // bcrypt.genSaltSync: da 10 vuelta de hash
})

const isValidPassword = ((password,passwordHashed)=>{
    return bcrypt.compareSync(password,passwordHashed)  // Compara la contraseña con la que nos pasan y la hasheada
})

module.exports = {
    hashPassword,
    isValidPassword
}