var mongoose = require('mongoose');
var config = require('../config.js');

var codeSchema = new mongoose.Schema({
    tournamentId: String,
    code: Number
});

module.exports = mongoose.model('codes', codeSchema);