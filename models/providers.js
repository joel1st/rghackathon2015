var mongoose = require('mongoose');
var config = require('../config.js');
/**
 * Used to build up the long champ list on the homepage and the
 * individual champion roles on the left hand side of the champion pages.
 */
var providerSchema = new mongoose.Schema({
    providerId: {
    	type: Number,
    	required: true,
    	unique: true
    },
    region: {
    	type: String,
    	required: true,
    	unique: true,
    	enum: config.supportedRegions 
    } 
});

module.exports = mongoose.model('providers', providerSchema);
