const jwt = require("jsonwebtoken")
const validateJWT = require("../middlewares").validateJWT
const checkIfUserExist = require("../middlewares").checkIfUserExist
const Router = require('express').Router

const router = new Router();

const collection = "messages"

router.get('/get-10', (req, res, next) => {
    const db = req.app.locals.db
    const { index } = req.query
    db.collection(collection).find().sort({createdAt: -1}).skip(Number(index)).limit(15).toArray()
    .then(result => res.json(result))
    .catch(next)
});

router.post('/post-message', checkIfUserExist, validateJWT, (req, res, next) => {
    const db = req.app.locals.db
    const socket = req.app.locals.socket
    const { message } = req.body
    delete message._id
    message.createdAt = new Date(message.createdAt)
    db.collection(collection).insertOne(message)
    .then(result => {
        socket.emit('message', result.ops[0])
        res.json({mensaje: "OK"})
    })
    .catch(next)
});

module.exports = router