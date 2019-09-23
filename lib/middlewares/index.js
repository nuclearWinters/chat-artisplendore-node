const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const collectionA = "users"

const decodeJWT = (req, res, next) => {
    const token = req.body.token
    if (token) {
        req.body.userFromInput = jwt.decode(req.body.token)
        next()
    } else {
        res.status(403).json({mensaje: "No tines las credenciales para realizar esta operación."})
    }
}

const checkIfUserExist = (req, res, next) => {
    const userInput = req.body.userInput
    const db = req.app.locals.db
    db.collection(collectionA).find({Usuario: userInput.Usuario}).toArray((err, documents) => {
        if (err) next(err)
        else {
            if (documents.length !== 0) {
                req.body.userDB = documents[0]
                next()
            }
            else {
                res.status(403).json({mensaje: "El usuario no existe."})
            }
        }
    })
}

const checkIfUserDontExist = (req, res, next) => {
    const userInput = req.body.userInput
    console.log(userInput)
    const db = req.app.locals.db
    db.collection(collectionA).find({Usuario: userInput.Usuario}).toArray((err, documents) => {
        if (err) next(err)
        else {
            if (documents.length === 0) {
                next()
            }
            else {
                res.status(403).json({mensaje: "El usuario ya existe."})
            }
        }
    })
}

const validateJWT = (req, res, next) => {
    const { token, userDB } = req.body
    jwt.verify(token, userDB.Contraseña, (err, decoded) => {
        if (err) next(err)
        else next()
    });
}

const compareHashedPassword = async (req, res, next) => {
    const { userDB, userInput } = req.body
    bcrypt.compare(userInput.Contraseña, userDB.Contraseña)
    .then(match => {
        if (match) next()
        else {
            res.status(403).json({mensaje: "La contraseña no coincide."})
        }
    })
    .catch(next)
}

const hashPassword = async (req, res, next) => {
    const { userInput } = req.body
    var hash = bcrypt.hashSync(userInput.Contraseña, 8)
    req.body.hashedPassword = hash
    next()
}

module.exports = { validateJWT, decodeJWT, checkIfUserExist, compareHashedPassword, hashPassword, checkIfUserDontExist }