var mongoose = require('mongoose');
var config = require('../config.js');

var gamesSchema = new mongoose.Schema({
    gameId: String,
    tournamentId: Number,
    gameCode: String,
    blueTeam: Number,
    readTeam: Number,
    result: {
	type: String,
	enum: config.resultTypes
    }
    match: String // containing the file name for the data
});

module.exports = mongoose.model('games', gamesSchema);
