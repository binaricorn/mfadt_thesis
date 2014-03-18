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

var request = require('request');

var options = {
    url: 'https://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=fei&20liu',
    headers: {
        'User-Agent': 'request'
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.responseData.results[0]);
        /*
console.log(info.stargazers_count + " Stars");
        console.log(info.forks_count + " Forks");
*/
    }
}

request(options, callback);


io.sockets.on('connection', function(socket) {
    
    var $provider = require( './providers/arduino.js' ).init( socket );
    

   
});

