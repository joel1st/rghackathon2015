var mongoose = require('mongoose');
var config = require('../config.js');
/**
 * Used to build up the long champ list on the homepage and the
 * individual champion roles on the left hand side of the champion pages.
 */
var teamSchema = new mongoose.Schema({
    teamId: Number,
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
