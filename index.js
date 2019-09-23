const express = require('express')
const socket = require('socket.io')
const MongoClient = require ("mongodb").MongoClient
const config = require("./config")
const login = require("./lib/login")
const cors = require("cors")
const bodyParser = require("body-parser")

app = express()

let server;
let io;
const menuOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(cors())
app.use(bodyParser.json())

app.use(login);

MongoClient.connect(config.database.url, menuOptions, (err, client) => {
    // unable to get database connection pass error to CB
    if(err) {
        console.error(err.stack)
        process.exit(1)
    }
    // Successfully got our database connection
    // Set database connection and call CB
    else {
        app.locals.db = client.db("Chat")
        server = app.listen(3000, () => {
            console.log('¡Usando el puerto 3000!');
        });
        io = socket(server)
        io.on('connection', () => {
            console.log('made socket connection', socket.id)
            socket.on('chat', (data) => {
                io.socket.emit('chat', data)
            })
        })
    }
});