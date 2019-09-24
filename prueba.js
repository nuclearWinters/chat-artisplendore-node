const app = require('express')()
const server = require('http').Server(app);
const io = require('socket.io')(server)
const myroute = require("./route") //route file dir

app.use(myroute);

server.listen(3000, () => {
    console.log('¡Usando el puerto 3000!');
});

app.locals.io = io