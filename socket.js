let log         = require('logbootstrap');
var axios       = require('axios');

var dotenv      = require('dotenv');
dotenv.config();

// ------------------------
// SOCKET

let io;

const options = {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: 'http://localhost:' + process.env.PORT,
        methods: ["GET", "POST"]
    }
};

let start = (server) => {

    log('info', 'starting socket ...');
    io = require('socket.io')(server, options);

    const dashboard = io.of('/dashboard');

    dashboard.use((socket, next) => {
        log('info', 'using socket ... ');
        next();
    });

    dashboard.on('connection', socket => {

        log('info', 'socket connected -> ' + socket.id);

        // salva la connessione socket nel database

        /*
        socket.on('loadprivatekey', privatekey => {
            log('primary', 'receved privatekey ');
            
            

        });
        */

        socket.on("disconnect", (reason) => {
            // update database 
        });

    });
};
  
let getData = (url, callback) => {

    var config = {
        headers: {
            'Origin': 'http://localhost:' + process.env.PORT
        }
    };

    axios.get(url, config).then(response => {
        callback(false, response.data);
    }).catch(error => {
        log('danger', error);
        callback(true, error);
    });

};

module.exports = start