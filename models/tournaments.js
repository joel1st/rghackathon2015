var mongoose = require('mongoose');
var config = require('../config.js');

var tournamentSchema = new mongoose.Schema({
    ownerId: Number, // reference to users
    tournamentId: Number,
    teamSize: Number,
    region: {
    	type: String,
    	enum: config.supportedRegions 
    },
    spectate: {
		type: String,
		enum: config.spectateTypes	
	},
    pickType: {
    	type: String,
	enum: config.pickTypes	
    	//enum?
    },
    mapType: {
	type:String,
	enum: config.mapTypes
    },
    created: Date,
    modified: Date,
    teams: [Number] // team ids
});

module.exports = mongoose.model('tournaments', tournamentSchema);
