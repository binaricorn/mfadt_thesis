
var serial = require( "serialport" );
var SerialPort = serial.SerialPort;

// Replace with the device name in your machine.
var portName = "/dev/tty.usbserial-A700e171";

var sp = new SerialPort( portName, {
	baudrate: 115200,
	parser  :serial.parsers.readline( "\n" )
});

var present = false;
var absent = false;

var BPM;

var userPresence;
var userLeftFoot;
var userRightFoot;
//var userStanding;


module.exports = {

	init:function ( socket ) {

		/* When we get a new line from the arduino, send it to the browser via this socket */
		sp.on( "data", function ( data ) {
		
            data = data.toString();
            data = process_data(data);
            
            userPresence = data.a; // Range finder value [0 or 1]
            userLeftFoot = data.b; // Pressure sensor value [0 to 1023]
            userRightFoot = data.c; // Pressure sensor value [0 to 1023]
            userLeftHand = data.d; // Button press value [0 or 1]
            userRightHand = data.e; // Button press value [0 or 1]
            //BPM = data.f;
            
            
            if (data.f != undefined) {
                BPM = data.f;
                //BPM = BPM.replace("B", "");    
            } else {
                BPM = 0;
            }
            
                
                socket.emit("userPresence", data.a);
                socket.emit("userStanding", data.b, data.c);
                socket.emit("userButtonsPressed", data.d, data.e);
                socket.emit("userHeartRate", BPM);
            
            
            
            
            
            function process_data(data) {
        		var ret = {
        			a: 0,
        			b: 0,
        			c: 0,
        			d: 0,
        			e: 0,
        			f: 0
        		};
        		
        		var array = data.split(',');
        		
        		//console.log(BPM);
        		
        		if (array.length < 6) return ret;
        		
                ret.a = array[0];
                ret.b = array[1];
                ret.c = array[2];
                ret.d = array[3];
                ret.e = array[4];
                ret.f = array[5];
                return ret;
                
                console.log(data.f);
        	}
    
    		});

	}

};

