'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Packet Schema
 */
var PacketSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},	
	type: {
		type: String,
		default: '',
		trim: true
	},
	value: {
		type: String,
		default: '',
		trim: true
	},
	device:{
		type: Schema.ObjectId,
		ref: 'Device'
	}
});

mongoose.model('Packet', PacketSchema);