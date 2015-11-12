var mongoose = require('mongoose');
var config = require('../config.js');

var codeSchema = new mongoose.Schema({
    tournamentId: Number,
    code: String
});

module.exports = mongoose.model('codes', codeSchema);
