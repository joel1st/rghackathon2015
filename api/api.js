var express = require('express');
var app = express();

var router = express.Router();
var uuid = require('node-uuid');
var passport = require('passport');
var Account = require('../models/account');
var os = require('os');
var config = require('../config.js');
var riot = require('../riot/riot.js');
var providers = require('../models/providers.js');
var tournaments = require('../models/tournaments.js');
var teamsModel = require('../models/teams.js');
var gamesModel = require('../models/games.js');
// api -------------------------

router.post('/riot_notification', function(req, res, next) {
	console.log(res.body);
});

router.get('/isLoggedIn', passport.authenticate('local'), function(req, res, next) {
    res.send(200, 'Logged In');
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send(200, 'Successfully Logged In');
    });
});

router.post('/register',  function(req, res, next) {

	if(!req.body.username.length && !req.body.password.length){
		res.send(403, {error: "Username or Password not Provided."});
	} else {
		Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
			console.log(req.body, err, account);
		    if (err) {
		      return res.send(403, {error: "Sorry. That username already exists. Try again."});
		    }

		    passport.authenticate('local')(req, res, function () {
		        req.session.save(function (err) {
		            if (err) {
		                return next(err);
		            }
		            res.send(200, {data: "Successfully Created Account."});

		        });
		    });
		});

	}
    
});


router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

/* 
Send whatever data is needed 
for signup to front end 
(split into multiple endpoints if needed.)
*/
router.post('/create_tournament', passport.authenticate('local'), function(req, res) {
		var data = {};
		// check data
		if (config.spectateTypes.indexOf(req.body.spectatorType) <= -1) {
			data.success = false;
			data.message = "Invalid spectate type";		
		} else if (config.mapTypes.indexOf(req.body.mapType) <= -1) {
			data.success = false;
			data.message = "Invalid map type";		
		} else if (config.pickTypes.indexOf(req.body.pickType) <= -1) {
			data.success = false;
			data.message = "Invalid pick type";		
		} else if (req.body.teamSize > 5 || req.body.teamSize < 1) {
			data.success = false;
			data.message = "Invalid team size";		
		} else if (req.body.name == "") {
			data.success = false;
			data.message = "Invalid Tournament name";
		} else if (config.supportedRegions.indexOf(req.body.region) <= -1) {
			data.success = false;
			data.message = "Invalid Region";		
		} else { // all cool now
			// so request it from the riot api
			providers.findOne({'region': req.body.region}, function(err, response) {	
				var data = {};
				if (!err) {
					riot.createTournament(req.body.name, response.providerId, function(err, response) {
						if (!err) {
							// update the correct item
							tournaments.update({"tournamentId": response}, {"spectatorType": req.body.spectatorType, "pickType": req.body.pickType, "mapType": req.body.mapType, "teamSize": req.body.teamSize, "name": req.body.name ,"region": req.body.region, "teamSize": req.body.teamSize, "ownerId": req.session.username}, function (err, numAffected) {});
							data.success = true;
						} else {
							data.success = false;
						}
					res.json(data);
					});
				} else {
					data.success = false;
					res.json(data);
				}
			});
			return;
		}
		// data is ready now
		res.json(data);
	});

router.post('/createTeamsAndMatches', passport.authenticate('local'), function(req,  res) {
	var data = {};
	// make sure tournament exists
	var participants = req.body.participants.split(", ");
	tournaments.findOne({"tournamentId": req.body.tournamentId, "region": req.body.region, "ownerId": req.session.username}, function(err, response) {
		if (!err) {
			// now do the algorithm stuff
			var numberOfParticipants = participants.length;
			var numberOfTeams = Math.floor(numberOfParticipants / response.teamSize);
			var teams = [];
			for (var i = 0; i < numberOfTeams; i++) {
				teams.push([]);
			}
			for (var i = 0; i < numberOfTeams * response.teamSize; i++) {
				var randomNumber = Math.floor(Math.random() * (participants.length - 1));
				teams[i % numberOfTeams].push(participants[randomNumber]);
				participants.splice(randomNumber, 1);
			}

			// teams are made
			// make the brackets
			var nextSmaller2 = 1;
			while (nextSmaller2 < teams.length) {
				nextSmaller2 *=2;
			}
			nextSmaller2 /= nextSmaller2 == teams.length ? 1 : 2; // we're one too high if it ended
			preGames = teams.length - nextSmaller2;
			
			// do the stuff -> preGames
			games = [];
			results = [[]];
			for (var i = 0; i < teams.length; i += 1) {
				if (i < preGames) {
					games.push([-1, i]);
					results[0].push([0,1]);
				} else {
					games.push([i, i+1]);
					i++;// increase by two (with the for above!!!)
				}
			}
			// put the stuff into the database
			// add the teams
			var teamToObject = [];
			for (var i = 0; i < teams.length; i++) {
				var members = [];
				for (var j = 0; j < teams[i].lenght; j++) {
					members.push({"summonerId": teams[i][j], "name": teams[i][j]});
				}
				var team = new teamsModel({"members": members, "name": i, "region": req.body.region});
				team.save(function(err, response) { 
					if (!err) {
						var map = {}; 
						map.name = i;
						map.id = response.id; 
						teamToObject.push(map);
					} else {
						res.send({"success": false, "message": "Couldn't insert teams"});
					}
				});
			}
			// create the games. skip number of pregames
			for (var i = preGames; i < games.length;i++) {
				// insert into game
				var game = new gamesModel({"blueTeam": games[i][0], "redTeam": games[i][1], "tournamentId": req.body.tournamentId, "result": "TBD", "order": i});
				game.save(function(err, resp) { if (err) {res.json({"success": false, "message": "Failed to add games"});}});
			}
			res.json({"success": true, "teams": teams, "results": results, "games": games});
		} else {
			res.json({"success": false, "message": "Tournament not found"});
		}		
	});
});

router.route('/filters')
	.get(function(req, res) {
		res.send('filters');
	});


router.get('/generate', function(req, res) {
		res.send('generate');
	});

// Generate a callback
router.get('/generate_callback', function(req, res) {
		res.send(uuid.v1());
	});

module.exports = router;
