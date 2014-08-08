'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Device Schema
 */
var DeviceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Device name',
		trim: true
	},
	description: {
		type: String,
		default: ''
	},
	location:{
		type: String,
		default: ''
	},
	networkAddress: {
		type: String,
		default: ''
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

DeviceSchema.statics.findByNetworkAddress = function (networkAddress, cb) {
  return this.model('Device').find({ networkAddress: networkAddress }, cb);
};

mongoose.model('Device', DeviceSchema);

