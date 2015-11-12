var mongoose = require('mongoose');
var config = require('../config.js');
/**
 * Used to build up the long champ list on the homepage and the
 * individual champion roles on the left hand side of the champion pages.
 */
var tournamentSchema = new mongoose.Schema({
    ownerId: Number, // reference to users
    tournamentId: Number,
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
    created: Date,
    modified: Date,
    teams: [Number] // team ids
});

module.exports = mongoose.model('tournaments', tournamentSchema);
