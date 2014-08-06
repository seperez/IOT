'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Packet = mongoose.model('Packet'),
	Device = mongoose.model('Device'),
    _ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Packet already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Packet
 */
exports.create = function(req,res) {
console.log('req',req);	
	var packet = new Packet(req);
	var myDevice = new Device({ networkAddress: req.device });
	console.log('Equipo1: ', myDevice);
	
	myDevice.findByNetworkAddress(function (err, device) {
		console.log('Equipo2: ', device);
		packet.device = device.id;
		console.log('Paquete', packet);

		// packet.save(function(err) {
		// 	if (err) {
		// 		console.log(err);			
		// 	} else {
		// 		console.log(packet);
		// 	}
		// });
	});
};

/**
 * Show the current Packet
 */
exports.read = function(req, res) {
	res.jsonp(req.packet);
};

/**
 * List of Packets
 */
exports.list = function(req, res) { 
	Packet.find().sort('-created').populate('packet', 'created').exec(function(err, packets) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(packets);
		}
	});
};

exports.parse = function (packet) {
	var data = packet.split('|');

	if (data.length === 0)
		return null;

	var packetObject = {
		device: data[0],
		type: data[1],
		value: data[2]
	};

	return packetObject;
};

var codes = {
	'00': {
		description: 'Sync'	
	},
	'01': {
		description: 'Temperature',
		unit:'°c'
	},
	'02':{
		description: 'Humidity',
		unit:'%'
	},
	'03':{
		description: 'Sound',
		unit:'db'
	}
};
