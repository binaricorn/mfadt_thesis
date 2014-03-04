var http = require('http');
var util = require('util');
var fs = require('fs');

var connect = require('connect');

// This is the syntax for Heroku to understand what port is requested
var port = process.env.PORT || 5000;

var app = connect.createServer(
	connect.static(__dirname + "/public")
).listen(port);

var io = require("socket.io").listen(app);



io.sockets.on('connection', function(socket) {
    
    var $provider = require( './providers/arduino.js' ).init( socket );
    

   
});

