var mongoose = require('mongoose');
var config = require('../config.js');
/**
 * Used to build up the long champ list on the homepage and the
 * individual champion roles on the left hand side of the champion pages.
 */
var providerSchema = new mongoose.Schema({
    providerId: Number,
    region: {
    	type: String,
    	enum: config.supportedRegions 
    } 
});

module.exports = mongoose.model('providers', providerSchema);
