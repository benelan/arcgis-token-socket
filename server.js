const app = require("express")(),
    server = require('http').Server(app),
    request = require('request'),
    path = require('path'),
    io = require('socket.io')(server);

app.get('/', (req, res) => {
    res.sendFile('map.html', { root: path.join(__dirname, '/') });
    io.on('connection', (socket) => {
        request.post({
            url: 'https://www.arcgis.com/sharing/rest/generateToken',
            json: true,
            form: {
                'f': 'json',
                'username': 'USERNAME', // change this
                'password': 'PASSWORD', // this too
                'referer': 'localhost'  // and this for prod
            }
        }, function (error, response, body) {
            io.emit("msg", { body });
        });
    });
})

server.listen(process.env.PORT || 8001);