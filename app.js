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
// if .listen() is set to another port then that means the socket is listening on another port...


var script_model = {
    0 : {
        system: {
          0: "Hi, I've been expecting you.",
          1: "I'm really glad you've decided to come in for our quick 5 minute interview.",
          2: "I’m so excited that you might be joining our team.",
          3: "Please have a seat and we’ll get started."  
        },
        audio: {
          0: "0_0",
          1: "0_1",
          2: "0_2",
          3: "0_3"  
        }
    },
    
    1: {
        system: {
          0: "I apologize for my rudeness but I am having trouble finding the correct faces in my program.",
          1: "Could you please remind me of your name?"
        },
        audio: {
          0: "1_0",
          1: "1_1"
        }
    },
    
    2: {
        system: {
            0: "Thank you username.",
            1: "We have a few openings at HALtech. Which position are you applying for?"
        },
        audio: {
            0: "2_0",
            1: "2_1"
        }
        
    },
    
    3: {
        system: {
            0: "Thank you username for your cooperation and patience, ",
            1: "My name is Judy and I am a second-generation manager created from the original Judy Santos, who we lost 5 years ago.",
            2: "We were lucky to have her.",
            2: "Thankfully, the team at HALtech had her uploaded to the system before her last days."
        },
        audio: {
            0: "0"
        }
    },
    
    4: {
        system: {
            0: "But enough about me, let’s go over the specifics of the job.",
            1: "Aside from your daily tasks as a sales support staff, it’s also very important for us to make sure you are happy at your job",
            2: "so that your joy can also be felt by our customers.",
            3: "Happy employees equals happy customers.",
            4: "We have a mantra we like to repeat to ourselves every morning with a smile on our face."
        },
        audio: {
            0: "0"
        }
    }
    
}

// Database stuff
var databaseUrl = "mydb"; // "username:password@example.com/mydb"
var collections = ["users", "reports"]
var db = require("mongojs").connect(databaseUrl, collections);


/*
db.users.save(script_model, function(err, saved) {
    if( err || !saved ) console.log("User not saved");
    else console.log("User saved");
});
*/


/* db.users.remove(); */

io.sockets.on('connection', function(socket) {

     socket.emit('script', script_model);
     
     /*
db.users.find(0, function(err, users) {
         if( err || !users) console.log("No female users found");
         else users.forEach( function(femaleUser) {
            socket.emit('female users', femaleUser);
        });
    });
*/    
   
});

