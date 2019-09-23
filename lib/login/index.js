const jwt = require("jsonwebtoken")
const checkIfUserExist = require("../middlewares").checkIfUserExist
const checkIfUserDontExist = require("../middlewares").checkIfUserDontExist
const compareHashedPassword = require("../middlewares").compareHashedPassword
const hashPassword = require("../middlewares").hashPassword
const Router = require('express').Router

const router = new Router();

const collection = "users"

router.post('/sign-in', checkIfUserExist, compareHashedPassword, (req, res, next) => {
    const userDB = req.body.userDB
    req.body.token = jwt.sign({
        Usuario: userDB.Usuario,
    }, userDB.Contraseña);
    res.send(req.body.token)
});

router.post('/sign-up', checkIfUserDontExist, hashPassword, (req, res, next) => {
    const hashedPassword = req.body.hashedPassword
    const db = req.app.locals.db
    const { Usuario } = req.body.userInput
    db.collection(collection).insertOne({
        Usuario,
        Contraseña: hashedPassword
    }).then(result => {
        res.json(result)
    }).catch(next)
});

module.exports = router