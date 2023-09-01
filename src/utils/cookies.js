const cookieParser = require("cookie-parser") // Requerimos cookie-parse

const cookieConf = (cookieParser('estaEsMiLlaveSecreta'))

module.exports = cookieConf;