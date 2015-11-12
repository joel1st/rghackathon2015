var mongoose = require('mongoose');
var config = require('../config.js');
/**
 * Used to build up the long champ list on the homepage and the
 * individual champion roles on the left hand side of the champion pages.
 */
var gamesSchema = new mongoose.Schema({
    gameId: String,
    tournamentId: Number,
    gameCode: String,
    blueTeam: Number,
    readTeam: Number,
    match: String // containing the file name for the data
});

module.exports = mongoose.model('games', gamesSchema);
