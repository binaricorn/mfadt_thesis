
var serial = require( "serialport" );
var SerialPort = serial.SerialPort;

// Replace with the device name in your machine.
var portName = "/dev/tty.usbserial-A700e171";

var sp = new SerialPort( portName, {
	baudrate:9600,
	parser  :serial.parsers.readline( "\n" )
});

var present = false;
var absent = true;

var strP = "present";
var strA = "absent";



module.exports = {

	init:function ( socket ) {

		/* When we get a new line from the arduino, send it to the browser via this socket */
		sp.on( "data", function ( data ) {
            data = data.toString('utf-8').trim();
            
            // send the state to the browser just once...
            if(data == strP && present == false) {
    			socket.emit( "arduinoTwo", data );
    			present = true;
            } 

		});

	}

};

