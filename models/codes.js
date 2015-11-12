var mongoose = require('mongoose');
var config = require('../config.js');
/**
 * Used to build up the long champ list on the homepage and the
 * individual champion roles on the left hand side of the champion pages.
 */
var codeSchema = new mongoose.Schema({
    tournamentId: String,
    code: Number
});

module.exports = mongoose.model('codes', codeSchema);