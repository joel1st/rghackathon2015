var mongoose = require('mongoose');
var config = require('../config.js');

var tournamentSchema = new mongoose.Schema({
    members: [{
        summonerId: Number,
        name: String
    }],
    name: String,
    region: {
    	type: String,
    	enum: config.supportedRegions 
    }
});

module.exports = mongoose.model('teams', teamSchema);
