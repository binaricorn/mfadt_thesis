
var serial = require( "serialport" );
var SerialPort = serial.SerialPort;

// Replace with the device name in your machine.
var portName = "/dev/tty.usbserial-A700e171";

var sp = new SerialPort( portName, {
	baudrate:9600,
	parser  :serial.parsers.readline( "\n" )
});

var present = false;
var absent = false;

var userPresence;
var userSitting;


module.exports = {

	init:function ( socket ) {

		/* When we get a new line from the arduino, send it to the browser via this socket */
		sp.on( "data", function ( data ) {
            data = data.toString();
            data = process_data(data);
            
            // a = Range finder value [0 or 1]
            userPresence = data.a;
            userSitting = data.b;
            
            if (userPresence == 0 && absent == false) {
                socket.emit("userPresence", data);
                absent = true;
            } else if (userPresence == 1 && present == false) {
                socket.emit("userPresence", data.a);
                present = true;
            }
            
            if (present == true) {
                socket.emit("userSitting", data.b);
            }
            
            function process_data(data) {
        		var ret = {
        			a: 0,
        			b: 0
        		};
        		
        		var array = data.split(',');
        		
        		if (array.length < 1) return ret;
            		ret.a = array[0];
                    ret.b = array[1];
                    return ret;
        	}
    
    		});

	}

};

