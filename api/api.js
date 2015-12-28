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
var es6_promise = require('es6-promise');
// checks login status (sends unsuccess and returns bool)
function checkLogin(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({sucess: false, message: "Unauthorized"});
  }
}

// api -------------------------

// Get notification from Riot when game ends
router.post('/riotNotification', function(req, res, next) {
  console.log(res.body);
  res.send(200, "All cool");
});

router.get('/isLoggedIn', checkLogin, function(req, res, next) {
    res.send({
        success: true,
        message: 'authorized',
        user: req.user.username
    });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
    res.status(200).send('Successfully Logged In');
});

router.post('/register', function(req, res, next) {

  if (!req.body.username || !req.body.password || !req.body.username.length || !req.body.password.length) {
    res.send(403, {
      error: "Username or Password not Provided."
    });
  } else {
    Account.register(new Account({
      username: req.body.username
    }), req.body.password, function(err, account) {
      console.log(req.body, err, account);
      if (err) {
        res.send(403, {
          error: "Sorry. That username already exists. Try again."
        });
      } else {
        res.status(200).send("Successfully created Account");
      }
    });

  }

});

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

/*
Send whatever data is needed
for signup to front end
(split into multiple endpoints if needed.)
*/
router.post('/createTournament', checkLogin, function(req, res) {
  if (!checkLogin(req, res)) {
    return;
  }
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
    providers.findOne({
      'region': req.body.settings.region
    }, function(err, response) {
      var data = {};
      if (!err && response) {
        riot.createTournament(req.body.settings.name, response.providerId, function(err, response) {
          if (!err) {
            var filters = [];
            // filters:
            req.body.filters = req.body.filters[0];
            var filterKeys = Object.keys(req.body.filters);
            for (var i = 0; i < filterKeys.length; i++) {
              console.log("Current Filters:", filterKeys[i]);
              if (req.body.filters[filterKeys[i]].status) {
                req.body.filters[filterKeys[i]].parameters = typeof req.body.filters[filterKeys[i]].parameters === 'undefined' ? "" : req.body.filters[filterKeys[i]].parameters;
                console.log("Pushing: ", {
                  type: filterKeys[i],
                  parameters: req.body.filters[filterKeys[i]].parameters
                });
                filters.push({
                  type: filterKeys[i],
                  parameters: req.body.filters[filterKeys[i]].parameters
                });
              }
            }
            console.log("filters now: ", filters);
            var teamSize = req.body.settings.teamSize;
            // update the correct item
            var tournament = new tournaments.tournaments({
              "tournamentId": response,
              "visibility": Boolean(req.body.settings.visibility),
              "filters": filters,
              "tournamentId": response,
              "spectatorType": req.body.settings.spectatorType,
              "pickType": req.body.settings.pickType,
              "mapType": req.body.settings.mapType,
              "teamSize": teamSize,
              "name": req.body.settings.name,
              "region": req.body.settings.region,
              "teamSize": req.body.settings.teamSize,
              "ownerId": req.session.username
            });
            data.success = true;
            data.tournamentId = response;
            data.region = req.body.settings.region;
            console.log("success");

            tournament.save(function(err, saved) {
              console.log("saving tournament");
              if (!err) {
                console.log("saved", saved);
                console.log("answer", data);
                res.json(data);
                // do other stuff like game gen / team gen
              } else {
                console.log("Tournament Creation", err);
                res.status(400).send("Something went wrong");
              }
            });
          } else {
            console.log("RITO WHY");
            console.log(err);
            data.success = false;
            data.tournamentId = null;
            data.region = null;
            res.json(data);
          }
        });
      } else {
        console.log("WRONG INPUT");
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

function getTeamObjects(team, region, teamSchemas, tournamentId) {
  return new es6_promise.Promise(function(resolve, reject) {
    riot.getSummonersByName(region, team.members, function(err, resp) {
      console.log("Rito Error", err);
      console.log("Resp:", resp);
      if (!err) {
        console.log("Current Team", team);
        var members = [];
        for (var j = 0; j < team.members.length; j++) {
          console.log("getting ", team.members[j]);
          console.log("resp is: ", resp[team.members[j].toLowerCase().replace(" ", "")]);
          members.push({
            name: team.members[j].name,
            summonerId: resp[team.members[j].toLowerCase().replace(" ", "")].id
          });
        }
        var teamSchema = new teamsModel.teams({
          name: team.name,
          members: members,
          tournamentId: tournamentId,
          region: region
        });
        teamSchemas.push(teamSchema);
        teamsModel.saveTeam(teamSchema).then(function() {
          resolve();
        }).catch(function(err) {
          reject(err);
        });
      } else {
        reject(err);
      }
    })
  });
}

// Teams are [{name: String, members: [String]}]
router.post('/createTeamsAndMatches', checkLogin, function(req, res) {
  if (!checkLogin(req, res)) {
    return;
  }
console.log("creating teams and matches");
  var data = {};
  // make sure tournament exists
  var teams = JSON.parse(req.body.teams);
  req.body.teams = teams; // update just in case
  var teamPromises = [];
  var teamSchemas = [];
  // check if there is any team
  teamsModel.loadTeam({
    tournamentId: req.body.tournamentId
  }).then(function(resp, err) {
    if (resp || err) {
      throw new Error("Games already loaded");
    }
  }).then(function() {
    console.log("Teams", teams);
    for (var i = 0; i < teams.length; i++) {
      teamPromises.push(getTeamObjects(teams[i], req.body.region, teamSchemas, req.body.tournamentId));
    }
    console.log("before promise all");
    return Promise.all(teamPromises)
  }).then(function() {
    return tournaments.loadTournament({
      "tournamentId": req.body.tournamentId,
      "region": req.body.region
    });
  }).then(function(tournament) {
    console.log("got tournament");
    // create teams
    var teamCount = teams.length;
    var lowerBaseTwo = Math.floor(Math.log(teamCount) / Math.log(2)); // that's the number of teams in the row above
    var gamesLastTotal = Math.pow(2, lowerBaseTwo - 1);
    var preTeams = teamCount - Math.pow(2, lowerBaseTwo);
    var gamesBefore = (1 - Math.pow(2, lowerBaseTwo - 1)) * (-1); // geometric series of 2^i from 0 to lowerBaseTwo-2
    var games = []; // array representing a binary tree (0 indexed), contais pairs of the form {blue: pointer into teams, red: pointer into teams, win: }

    for (var i = 0; i < gamesBefore; i++) {
      games.push({
        red: null,
        blue: null,
        win: "TBD"
      });
    }
    console.log("created empty games");
    // now the children
    var offset = games.length,
      preTeamsArr = [];
    var i = 0,
      preGamesCounter = 0;
    for (var i = 0; i < 2 * gamesLastTotal; i += 2) {
      var team = [];
      for (var j = 0; j < 2; j++) {
        if (i + j < preTeams) {
          preTeamsArr.push(teamSchemas[i + j]._id);
          team.push(null);
        } else {
          team.push(teamSchemas[i + j]._id);
        }
      }
      // we got the teams for the current game
      games.push({
        red: team[1],
        blue: team[0],
        win: "TBD"
      });
    }
    for (var i = 2 * gamesLastTotal; i < teams.length; i++) {
      preTeamsArr.push(teamSchemas[i]._id);
    }

    console.log("generated normal games");
    for (var i = 0; i < preTeams; i += 2) {
      // take two
      var blueTeam = preTeamsArr[i];
      var redTeam = preTeamsArr[i + 1];
      games.push({
        red: redTeam,
        blue: blueTeam,
        win: "TBD"
      });
    }
    console.log("created preTeams");
    // save games
    var gamePromises = [];
    for (var i = 0; i < games.length; i++) {
      gamePromises.push(gamesModel.saveGame(new gamesModel.games({
        tournamentId: req.body.tournamentId,
        gameCode: "",
        blueTeam: games[i].blue,
        redTeam: games[i].red,
        result: games[i].result,
        match: {},
        order: i,
        failedReasons: []
      })));
    }
    console.log("returning save promise");
    return Promise.all(gamePromises);
  }).then(function() {
    console.log("sending success");
    res.status(200).send({
      success: true
    });
  }).catch(function(error) {
    console.log(error);
    res.status(400).send({
      err: error,
      msg: "Error"
    })
  })
});

router.post('/generateTournamentCode', function(req, res) { // TODO maybe make it for a specific game?!
  if (!checkLogin(req, res)) {
    return;
  }
  tournaments.tournaments.findOne({
    "tournamentId": req.body.tournamentId,
    "region": req.body.region
  }, function(err, data) {
    if (!err && data != null) {
      riot.createCode(data.tournamentId, 1, data.region, function(err, response) {
        if (err) {
          es.json({
            "success": false,
            "message": err
          });
        } else {
          res.json({
            "success": true,
            "code": response
          });
        }
      });
    } else {
      res.json({
        "success": false,
        "message": "Tournament not found"
      });
    }
  });
});

// Champions Endpoint - returns stored champion data.
router.get('/champions', function(req, res) {
  Champions.find({}, function(err, champions) {
    if (err) console.log(err);
    if (champions) {
      res.json(champions);
    }
  });
});

// Items Endpoint - returns stored item data.
router.get('/items', function(req, res) {
  Items.find({}, function(err, items) {
    if (err) console.log(err);
    if (items) {
      res.json(items);
    }
  });
});

var currentTournamentState = function(req, res) {
  /**
   * 1. Generate the bracket out of the wins -> bases
   * 2. add the results!
   */
  teamsModel.find({
    "tournamentId": req.body.tournamentId
  }, function(err, resp) {
    var numberOfTeams = resp.length;
    gamesModel.find({
      "tournamentId": req.body.tournamentId
    }, function(err, resp) {}).sort({
      "order": 1
    }).exec(function(err, response) {
      // check games on lowest level by getting the number of teams
      var numberOfGames = response.length;
      console.log("Number Of Games", numberOfGames);
      console.log("Response", response);
      var nextSmaller2 = Math.floor(Math.log(numberofteams) / Math.log(2));
      preGames = numberOfTeams - nextSmaller2;

      teams = [];
      // do the stuff -> preGames
      games = [];
      results = [
        []
      ];
      var gameCounter = 0;
      console.log("Number Of Teams", numberOfTeams);
      for (var i = 0; i < gameCounter; i += 1) {
        if (i < preGames) {
          console.log("Adding by game");
          games.push([-1, i]);
          results[0].push([0, 1]);
          gameCounter++;
        } else {
          console.log(i);
          console.log("Adding game normal");
          games.push([i, i + 1]);
          console.log("GameCounter", gameCounter);
          if (response[gameCounter].result != "TBD") {
            if (response[gameCounter].result == "RED_WIN" || response[gameCounter].result == "BLUE_DISQ") {
              results[0].push([0, 1]);
            } else {
              results[0].push([1, 0]);
            }
          } else {
            results[0].push([]);
          }
          gameCounter++;
          i++; // increase by two (with the for above!!!)
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
              results[stageCounter].push([0, 1]);
            } else {
              results[stageCounter].push([1, 0]);
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
      teamsModel.find({
        "tournamentId": req.body.tournamentId
      }, function(err, resp) {
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

        res.json({
          "success": true,
          "teams": teams,
          "games": games,
          "results": results
        });
      });
    });
  });
}
router.post('/currentTournamentState', currentTournamentState);

router.post('/findTournament', function(req, res) {
  // find tournaments
  tournaments.tournaments.findOne({
    "name": req.body.name,
    "region": req.body.region
  }, function(err, response) {
    req.body.tournamentId = response.tournamentId;
    console.log("Tournament Id", response.tournamentId);
    if (!err) {
      currentTournamentState(req, res);
    } else {
      res.json({
        "success": false,
        "message": "error"
      });
    }

  });
});

module.exports = router;
