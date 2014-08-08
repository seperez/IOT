'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	serialport = require('serialport'),
	SerialPort = serialport.SerialPort;

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db);

// Init the express application
var app = require('./config/express')(db);

// Bootstrap passport config
require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('ProCusto application started on port ' + config.port);


// Config a serial port connection with Arduino Server
var sp = new SerialPort('COM5', {
    baudrate: 9600,
    parser: serialport.parsers.readline('#')
});

// Listen serial port. waiting for packets
sp.on('open', function () {
    console.log('\nSerial port connection open on COM5...\n');
	
	var packet = require('./app/controllers/packet.server.controller.js');
    
    sp.on('data', function(responsePacket) {
        if(responsePacket.length > 0) {
    		var myPacket = packet.parse(responsePacket);
            console.log(myPacket);

    		packet.create(myPacket);
    	}	
    });
});