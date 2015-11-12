var mongoose = require('mongoose');
var config = require('../config.js');

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