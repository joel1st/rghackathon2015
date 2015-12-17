var mongoose = require('mongoose');
var config = require('../config.js');
var es6_promise = require("es6-promise");

var gamesSchema = new mongoose.Schema({
  gameId: String, // expect _id as the metadata
  tournamentId: Number,
  gameCode: String,
  blueTeam: String,
  redTeam: String,
  checked: {type: Boolean, "default": false},
  result: {
    type: String,
    enum: config.resultTypes
  },
  match: {},
  order: Number,
  failedReasons: { type : Array , "default" : [] }
});

var games = mongoose.model('games', gamesSchema);

function loadGame(findCondition) {
  return new es6_promise.Promise(function(resolve, reject) {
      games.findOne(findCondition, function(err, internalGame) {
        if (!err && internalGame != null) {
          resolve(internalGame);
        } else {
          reject("Error while loading Game: " + err);
        }
      });
    });
  }
  module.exports = {
    games: games,
    loadGame: loadGame
  };
