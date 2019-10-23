const app = require("express")(),
    server = require('http').Server(app),
    helmet = require('helmet'),
    request = require('request'),
    path = require('path'),
    io = require('socket.io')(server);

app.use(helmet());
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))

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

app.get('/', (req, res) => {
    res.sendFile('map.html', { root: path.join(__dirname, '/') });
    
})

server.listen(process.env.PORT || 8001);