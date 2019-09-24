const app = require('express')()
const server = require('http').Server(app);
const io = require('socket.io')(server)
const MongoClient = require ("mongodb").MongoClient
const config = require("./config")
const login = require("./lib/login")
const messages = require("./lib/messages")
const cors = require("cors")
const bodyParser = require("body-parser")

const menuOptions = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(cors())
app.use(bodyParser.json())

app.use(login);
app.use(messages);

MongoClient.connect(config.database.url, menuOptions, (err, client) => {
    if(err) {
        console.error(err.stack)
        process.exit(1)
    }
    else {
        app.locals.db = client.db("Chat")
        app.locals.io = io
        server.listen(3000, () => {
            console.log('¡Usando el puerto 3000!');
        });
    }
});