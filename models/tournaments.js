var mongoose = require('mongoose');
var config = require('../config.js');

var tournamentSchema = new mongoose.Schema({
    ownerId: String, // reference to users
    tournamentId: Number,
    teamSize: Number,
    region: {
    	type: String,
    	enum: config.supportedRegions 
    },
    spectatorType: {
		type: String,
		enum: config.spectateTypes	
	},
    pickType: {
    	type: String,
	enum: config.pickTypes	
    },
    mapType: {
	type:String,
	enum: config.mapTypes
    },
    name: String,
    created: Date,
    modified: Date,
    visibility: Boolean,
    filter: String,
    match: {}
});

module.exports = mongoose.model('tournaments', tournamentSchema);
