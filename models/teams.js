var mongoose = require('mongoose');
var config = require('../config.js');
var es6_promise = require("es6-promise");

var teamSchema = new mongoose.Schema({
    members: [{
        summonerId: String,
        name: String
    }],
    name: String,
    tournamentId: Number,
    region: {
    	type: String,
    	enum: config.supportedRegions
    },
});

function loadTeam(findCondition) {
return new es6_promise.Promise(function (resolve, reject) {
  teams.findOne(findCondition, function (err, team) {
    if (!err && team) {
      console.log(team),
      resolve(team);
    } else {
      reject ("Error while loading Team" + err);
    }
  });
});
}

var teams = mongoose.model('teams', teamSchema);
module.exports = {teams: teams, loadTeam: loadTeam};
