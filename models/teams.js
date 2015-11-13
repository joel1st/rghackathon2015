var mongoose = require('mongoose');
var config = require('../config.js');

var teamSchema = new mongoose.Schema({
    members: [{
        summonerId: String,
        name: String
    }],
    name: String,
    tournamentId: Number,
    region: {
    	type: String,
    	enum: config.supportedRegions 
    },
});

module.exports = mongoose.model('teams', teamSchema);
