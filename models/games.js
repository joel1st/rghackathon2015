var mongoose = require('mongoose');
var config = require('../config.js');

var gamesSchema = new mongoose.Schema({
    tournamentId: String,
    gameId: String,
    match: {}
});

module.exports = mongoose.model('games', gamesSchema);