var mongoose = require('mongoose');
var config = require('../config.js');
/**
 * Used to build up the long champ list on the homepage and the
 * individual champion roles on the left hand side of the champion pages.
 */
var tournamentSchema = new mongoose.Schema({
    ownerId: String,
    tournamentId: String,
    region: {
    	type: String,
    	enum: config.supportedRegions 
    },
    spectate: Boolean,
    pickType: {
    	type: String,
    	//enum?
    },
    created: Date,
    modified: Date
});

module.exports = mongoose.model('tournaments', tournamentSchema);