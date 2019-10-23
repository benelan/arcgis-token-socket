const app = require("express")(),
    server = require('http').Server(app),
    helmet = require('helmet'),
    request = require('request'),
    path = require('path'),
    io = require('socket.io')(server);

// http header security
app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))

// each connection generates a new token
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
    }, (error, response, body) => {
        io.emit("msg", { body }); // sends token to client
    });
});

// serves static map file
app.get('/', (req, res) => {
    res.sendFile('map.html', { root: path.join(__dirname, '/') });
})

server.listen(process.env.PORT || 8001);