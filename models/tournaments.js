var mongoose = require('mongoose');
var config = require('../config.js');
var es6_promise = require("es6-promise");

var tournamentSchema = new mongoose.Schema({
  ownerId: String, // reference to users
  tournamentId: Number,
  teamSize: Number,
  region: {
    type: String,
    enum: config.supportedRegions
  },
  spectatorType: {
    type: String,
    enum: config.spectateTypes
  },
  pickType: {
    type: String,
    enum: config.pickTypes
  },
  mapType: {
    type: String,
    enum: config.mapTypes
  },
  name: String,
  created: Date,
  modified: Date,
  visibility: Boolean,
  filters: [], // object with filter type and parameters
  match: {}
});
var tournaments = mongoose.model('tournaments', tournamentSchema);
// returns promise of a tournament or fails
function loadTournament(findCondition) {
  return new es6_promise.Promise(function(resolve, reject) {
    tournaments.findOne(findCondition, function(err, internalTournament) {
      if (!err && internalTournament) {
        console.log("tournament", internalTournament);
        resolve(internalTournament);
      } else {
        console.log("Tournament Error", err);
        console.log("null?".internalTournament);
        reject("Error or Tournamnent not found: " + err);
      }
    });
  });
}

module.exports = { tournaments: tournaments, loadTournament: loadTournament };
