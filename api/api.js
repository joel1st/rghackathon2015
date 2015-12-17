var express = require('express');
var app = express();

var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var os = require('os');
var config = require('../config.js');
var riot = require('../riot/riot.js');
var providers = require('../models/providers.js');
var tournaments = require('../models/tournaments.js');
var teamsModel = require('../models/teams.js');
var gamesModel = require('../models/games.js');
var Champions = require('../models/champions.js');
var Items = require('../models/items.js');
// api -------------------------

// Get notification from Riot when game ends
router.post('/riotNotification', function(req, res, next) {
	console.log(res.body);
	res.send(200, "All cool");
});

router.get('/isLoggedIn', passport.authenticate('local'), function(req, res, next) {
    res.send(200, 'Logged In');
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.status(200).send('Successfully Logged In');
    });
});

router.post('/register',  function(req, res, next) {

	if(!req.body.username || !req.body.password || !req.body.username.length || !req.body.password.length){
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
router.post('/createTournament', function(req, res) {
	console.log("HERE BODY", req.body);
		var data = {};
		// check data
		if (config.spectateTypes.indexOf(req.body.settings.spectatorType) <= -1) {
			data.success = false;
			data.message = "Invalid spectate type";
		} else if (config.mapTypes.indexOf(req.body.settings.mapType) <= -1) {
			data.success = false;
			data.message = "Invalid map type";
		} else if (config.pickTypes.indexOf(req.body.settings.pickType) <= -1) {
			data.success = false;
			data.message = "Invalid pick type";
		} else if (req.body.settings.teamSize > 5 || req.body.settings.teamSize < 1) {
			data.success = false;
			data.message = "Invalid team size";
		} else if (req.body.settings.name == "") {
			data.success = false;
			data.message = "Invalid Tournament name";
		} else if (config.supportedRegions.indexOf(req.body.settings.region) <= -1) {
			data.success = false;
			data.message = "Invalid Region";
		} else { // all cool now
			// so request it from the riot api
			providers.findOne({'region': req.body.settings.region}, function(err, response) {
				var data = {};
				if (!err && response) {
					riot.createTournament(req.body.settings.name, response.providerId, function(err, response) {
						if (!err) {
							console.log(typeof req.body.visibility);
							console.log(req.body.visibility);
							console.log(Boolean(req.body.visibility));
							console.log(req.body.filters);
							var filters = [];
							// filters:
							req.body.filters = req.body.filters[0];
							var filterKeys = Object.keys(req.body.filters);
							for (var i = 0; i < filterKeys.length; i++) {
								console.log("Current Filters:", filterKeys[i]);
								if (req.body.filters[filterKeys[i]].status) {
									req.body.filters[filterKeys[i]].parameters = typeof req.body.filters[filterKeys[i]].parameters === 'undefined' ? "" : req.body.filters[filterKeys[i]].parameters;
									console.log("Pushing: ", { type: filterKeys[i], parameters: req.body.filters[filterKeys[i]].parameters });
									filters.push({ type: filterKeys[i], parameters: req.body.filters[filterKeys[i]].parameters });
								}
							}
							console.log("filters now: ", filters);
							var teamSize = req.body.settings.teamSize;
							// update the correct item
							var tournament = new tournaments.tournaments({"tournamentId": response, "visibility": Boolean(req.body.settings.visibility), "filters": filters, "tournamentId": response, "spectatorType": req.body.settings.spectatorType, "pickType": req.body.settings.pickType, "mapType": req.body.settings.mapType, "teamSize": teamSize, "name": req.body.settings.name ,"region": req.body.settings.region, "teamSize": req.body.settings.teamSize, "ownerId": req.session.username});
							data.success = true;
							data.tournamentId = response;
							data.region = req.body.region;
							console.log("success");

							tournament.save(function (err, saved) {
								console.log("saving tournament");
								if (!err) {
									console.log("saved", saved);
									res.json(data);
									// do other stuff like game gen / team gen
								} else {
									console.log("Tournament Creation", err);
									res.status(400).send("Something went wrong");
								}
							});
						} else {
							console.log(err);
							data.success = false;
							data.tournamentId = null;
							data.region = null;
							res.json(data);
						}
					// now generate some new stuff (games etc.)

					});
				} else {
					data.success = false;
					data.tournamentId = null;
					data.region = null;
					res.json(data);
				}
			});
			return;
		}
		// data is ready now
		res.json(data);
	});

router.post('/createTeamsAndMatches',  function(req,  res) {
	var data = {};
	// make sure tournament exists
	var participants = req.body.participants.split(", ");
	tournaments.tournaments.findOne({"tournamentId": req.body.tournamentId, "region": req.body.region}, function(err, response) {
		if (!err) {
			// Create random teams
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

			// create games
			var nextSmaller2 = Math.floor(Math.log(teams.length) / Math.log(2));
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
				for (var j = 0; j < teams[i].length; j++) {
					members.push({"summonerId": teams[i][j], "name": teams[i][j]});
				}
				console.log("Members", members);
				var team = new teamsModel({"members": members, "name": i, "region": req.body.region, "tournamentId": req.body.tournamentId});
				team.save(function(err, response) {
					if (!err) {
						var map = {};
						map.name = i;
						map.id = response.id;
						teamToObject.push(map);
					} else {
						console.log(err);
					}
				});
			}
			// create the games. skip number of pregames
			for (var i = 0; i < games.length;i++) {
				// insert into game
				var won = games[i][0] == -1 ? "RED_WIN" : "TBD";
				var game = new gamesModel({"blueTeam": games[i][0], "redTeam": games[i][1], "tournamentId": req.body.tournamentId, "result": won, "order": i});
				game.save(function(err, resp) { if (err) {res.json({"success": false, "message": "Failed to add games"});}});
			}
			res.json({"success": true, "teams": teams, "results": results, "games": games});
		} else {
			res.json({"success": false, "message": "Tournament not found"});
		}
	});
});

router.post('/generateTournamentCode', function(req,res) {
	tournaments.tournaments.findOne({"tournamentId": req.body.tournamentId, "region": req.body.region}, function(err, data) {
		if (!err && data != null) {
			riot.createCode(data.tournamentId, 1, data.region, function(err, response) {
		        if (err) {
		            es.json({"success": false, "message": err});
		        } else {
		        	res.json({"success": true, "code": response});
		        }
		    });
		} else {
			res.json({"success": false, "message": "Tournament not found"});
		}
	});
});

// Champions Endpoint - returns stored champion data.
router.get('/champions', function(req, res) {
	Champions.find({}, function(err, champions) {
		if(err) console.log(err);
		if(champions) {
			res.json(champions);
		}
	});
});

// Items Endpoint - returns stored item data.
router.get('/items', function(req, res) {
	Items.find({}, function(err, items) {
		if(err) console.log(err);
		if(items) {
			res.json(items);
		}
	});
});

var currentTournamentState = function(req,  res) {
	/**
	 * 1. Generate the bracket out of the wins -> bases
	 * 2. add the results!
	 */
	teamsModel.find({"tournamentId": req.body.tournamentId}, function(err, resp) {
		var numberOfTeams = resp.length;
	gamesModel.find({"tournamentId": req.body.tournamentId}, function(err, resp) {}).sort({"order":1}).exec(function(err, response) {
			// check games on lowest level by getting the number of teams
			var numberOfGames = response.length;
			console.log("Number Of Games", numberOfGames);
			console.log("Response", response);
			var nextSmaller2 = Math.floor(Math.log(numberofteams) / Math.log(2));
			preGames = numberOfTeams - nextSmaller2;

			teams = [];
			// do the stuff -> preGames
			games = [];
			results = [[]];
			var gameCounter = 0;
			console.log("Number Of Teams", numberOfTeams);
			for (var i = 0; i < gameCounter; i += 1) {
				if (i < preGames) {
					console.log("Adding by game");
					games.push([-1, i]);
					results[0].push([0,1]);
					gameCounter++;
				} else {
					console.log(i);
					console.log("Adding game normal");
					games.push([i, i+1]);
					console.log("GameCounter", gameCounter);
					if (response[gameCounter].result != "TBD") {
						if (response[gameCounter].result == "RED_WIN" || response[gameCounter].result == "BLUE_DISQ") {
							results[0].push([0,1]);
						} else {
							results[0].push([1,0]);
						}
					} else {
						results[0].push([]);
					}
					gameCounter++;
					i++;// increase by two (with the for above!!!)
				}
			}
			// TODO add other game results
			// we've nextSmaller2*2 games
			var gamesStage = nextSmaller2;
			var gamesInCurrentStage = 0;
			results.push([]);
			var stageCounter = 1;
			for (var i = gameCounter; i < numberOfGames; i++) {
				if (gamesInCurrentStage <= gamesStage) {
					if (response[i].result != "TBD") {
						if (response[i].result == "RED_WIN" || response[i].result == "BLUE_DISQ") {
							results[stageCounter].push([0,1]);
						} else {
							results[stageCounter].push([1,0]);
						}
					} else {
						results[stageCounter].push([]);
					}
					gamesInCurrentStage++;
				}
				if (gamesInCurrentStage == gamesStage) {
					gamesInCurrentStage = 0;
					gamesStage /= 2;
					stageCounter++;
				}
			}
			console.log("doing the teams");
			// fetch teams
			teamsModel.find({"tournamentId": req.body.tournamentId}, function(err, resp) {
				console.log("TEAMS", resp);
				var teams = [];
				for (var i = 0; i < resp.length; i++) {
					var curTeam = [];
					for (var j = 0; j < resp[i].members.length; j++) {
						console.log("getting name", resp[i].members[j].name);
						curTeam.push(resp[i].members[j].name);
					}
					console.log(curTeam);
					teams.push(curTeam);
				}

				res.json({"success": true, "teams": teams, "games": games, "results": results});
			});
		});
	});
}
router.post('/currentTournamentState',  currentTournamentState);

router.post('/findTournament',  function(req,  res) {
	// find tournaments
	tournaments.tournaments.findOne({"name": req.body.name, "region": req.body.region}, function (err, response) {
		req.body.tournamentId = response.tournamentId;
		console.log("Tournament Id", response.tournamentId);
		if (!err) {
			currentTournamentState(req, res);
		} else {
			res.json({"success": false, "message": "error"});
		}

	});
});

module.exports = router;
