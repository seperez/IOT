'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
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
				message = 'Device already exists';
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
 * Create a Device
 */
exports.create = function(req, res) {
	var device = new Device(req.body);
	device.user = req.user;

	device.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};

/**
 * Show the current Device
 */
exports.read = function(req, res) {
	res.jsonp(req.device);
};

/**
 * Update a Device
 */
exports.update = function(req, res) {
	var device = req.device ;

	device = _.extend(device , req.body);

	device.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};

/**
 * Delete an Device
 */
exports.delete = function(req, res) {
	var device = req.device ;

	device.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(device);
		}
	});
};

/**
 * List of Devices
 */
exports.list = function(req, res) { Device.find().sort('-created').populate('device', 'name').exec(function(err, devices) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(devices);
		}
	});
};

/**
 * Device middleware
 */
exports.deviceByID = function(req, res, next, id) { Device.findById(id).populate('device', 'name').exec(function(err, device) {
		if (err) return next(err);
		if (! device) return next(new Error('Failed to load Device ' + id));
		req.device = device ;
		next();
	});
};

/**
 * Device authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.device.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};

