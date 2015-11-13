var providerId = 152;

var riot = require('../riot/riot.js');
var db = require('../db.js');
var tournaments = require('../models/tournaments.js');

riot.createTournament("Test notifications", providerId, function(err, data) {
    var tournamentId = data;
    tournaments.update({
        tournamentId: tournamentId
    }, {
        tournamentId: tournamentId,
        teamSize: 5,
        spectatorType: "ALL",
        pickType: "BLIND_PICK",
        mapType: "SUMMONERS_RIFT"
    }, {
        upsert: true
    }, function(err, data) {
        riot.createCode(tournamentId, 1, 'NA', function(err, data) {
            if (err) {
                console.log('Error: ' + err);
            } else {
            	console.log("Data: " + data);
            }
        });
    });
});