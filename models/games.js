var mongoose = require('mongoose');
var config = require('../config.js');

var gamesSchema = new mongoose.Schema({
    gameId: String,
    tournamentId: Number,
    gameCode: String,
    blueTeam: Number,
    redTeam: Number,
    result: {
	   type: String,
	   enum: config.resultTypes
    },
    match: {}
});

module.exports = mongoose.model('games', gamesSchema);
