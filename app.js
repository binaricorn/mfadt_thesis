var fs = require('fs');
var connect = require('connect');
var util = require('util');
var https = require('https');

var port = process.env.PORT || 5000;

var options = {
    key:    fs.readFileSync('certs/privatekey.pem'),
    cert:   fs.readFileSync('certs/certificate.pem')
};

var app = connect().use(connect.static(__dirname + "/public"));
var server = https.createServer(options,app).listen(port);

var io = require("socket.io").listen(server);


io.sockets.on('connection', function(socket) {
    
    var $provider = require( './providers/arduino.js' ).init( socket );
   
});