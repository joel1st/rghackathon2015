var http = require('http');
var db = require('./db.js');
var express = require('express');
var mongoose = require('mongoose');
var app = express();
var morgan = require('morgan');
var api = require('./api/api.js');
var riot = require('./riot/riot.js');
var path = require('path');
var getProviders = require('./middleware/get_providers.js');
var filters = require('./filters/filters.js');

var staticData = require('./riot/static_data.js');

var tournaments = require('./models/tournaments.js');
var games = require('./models/games.js');
var teams = require("./models/teams.js");

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var passport = require('passport');

app.use(bodyParser.json({
  limit: '2kb',
  extended: true
}));
app.use(bodyParser.urlencoded({
  limit: '2kb',
  extended: true
}));

//app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(getProviders);

app.use(express.static(path.join(__dirname, 'public')));

//app.use(flash()); // use connect-flash for flash messages stored in session
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// participantList must contain a field summonerId + summonerName (and may only contain on team (e. g. only teamId 0))
function checkTeamMembers(participantList, teamMemberList) {
  var found = false;
  var failedParticipants = [];
  var blueTeamId = -1;
  for (var i = 0; i < participantList.length;i++) {
    var currentParticipant = participantList[i];
    found = false;
    for (var j = 0; j < teamMemberList.length; j++) {
      if (teamMemberList[i].summonerId == currentParticipant.summonerId && (currentParticipant.teamId == blueTeamId || blueTeamId == -1)) {
          found = true;
          blueTeamId = currentParticipant.teamId;
          break; // stop looping we found someone who matches
      }
    }
    if (!found) {
      failedParticipants.push({participantId: currentParticipant.participantId, summonerId: currentParticipant.summonerId, summonerName: currentParticipant.summonerName});
    }
  }
  return failedParticipants;
}


// API to communicate with frontend
// only first game counts + player mismatch is your bad
app.post('/', function(req, res, next) {
  res.send(200, 'thanks for that sweet sweet data riot'); // we can already answer. only internal processing now
  req.body.metadata = JSON.parse(req.body.metadata); // is a string and we parse {gameId :_id of gameId, tournamentId: _id of tournament}
  riot.getMatch(req.body.shortCode, req.body.gameId, req.body.region.replace(/\d/g, ""), true, function(err, riotGame) {
    if (!err) {
      var internalGameGlob, teamList = new Array();
      var lastFailTime = -2; // -1 marks failure before game started (e. g. team members)
      // create a list of teams of participants and add summonerId and name to match.participants
      for (var i = 0; i < riotGame.participants.length; i++) {
        var currentParticipant = riotGame.participants[i];
        if (!teamList[currentParticipant.teamId]) {
          teamList[currentParticipant.teamId] = [];
        }
        teamList[currentParticipant.teamId].push(currentParticipant);
          for (var j = 0; j < riotGame.participantIdentities; j++) {
              if (riotGame.participantIdentities[j].participantId == currentParticipant.participantId) {
                currentParticipant.summonerId = riotGame.participantIdentities[j].player.summonerId;
                currentParticipant.summonerName = riotGame.participantIdentities[j].player.summonerName;
                break;
              }
          }
      }
      // load games / teams / tournament
      games.loadGame({ _id: req.body.metadata.gameId}).then(function(internalGame) { // load the game from the database
        if (internalGame.checked) { // first game counts
          return Promise.reject("Game was already checked");
        }
        internalGame.match = riotGame;
        internalGame.failedReason = []; // init failed reasons
        internalGameGlob = internalGame;
        return teams.loadTeam({_id: internalGame.blueTeam});
      }).then (function(blueTeam) {
        if (checkTeamMembers(teamList['100'], blueTeam.members).length == 0) { // check if the correct members were given
          internalGameGlob.failedReasons.push({type: "TEAM_MEMBERS", team: 100, valid: true});
        } else {
          internalGameGlob.result = config.ResultTypes.RED_WIN;
          lastFailTime = -1;
          internalGameGlob.failedReasons.push({type: "TEAM_MEMBERS", team: 100, valid: false});
        }
        return teams.loadTeam({_id: internalGameGlob.redTeam});
      }).then(function(redTeam) {
        if (checkTeamMembers(teamList['200'], redTeam.members).length == 0) {
          internalGameGlob.failedReasons.push({type: "TEAM_MEMBERS", team: 200, valid: true});
        } else {
          internalGameGlob.result = internalGameGlob.result === config.ResultTypes.RED_WIN ? "BOTH_DISQ" : "BLUE_WIN";
          internalGameGlob.failedReasons.push({type: "TEAM_MEMBERS", team: 200, valid: false });
        }
        return tournaments.loadTournament({_id: req.body.metadata.tournamentId});
      }).then(function(internalTournament) {
        for (var i = 0; i < internalTournament.filters.length; i++) {
          var returnVal = filterToFunction[internalTournament.filters[i].type](riotGame, internalTournament.filters[i].parameters);
          returnVale.type = internalTournament.filters[i];
          internalGameGlob.failedReasons.push(returnVal);
          if (!returnVal.valid && (lastFailTime > returnVal.timestamp || lastFailTime === -2)) {
            internalGameGlob.result = returnVal.team == 100 ? "RED_WIN" : "BLUE_WIN"
          }
        }
        internalGameGlob.checked = true;
        // and now save the game
        games.games.update({_id: internalGameGlob._id}, internalGameGlob, {multi: false, upsert: false}, function(err, numAffected) {
          if (err || numAffected > 1) {
            console.log("Error", err, numAffected);
          } else {
            console.log("All cool. Saved the game");
          }
        });
      }).catch(function (err) {
        console.log("Error", err);
      });
    } else {
      console.log("Error on Riots Side", err);
    }
  });
});

app.use('/api', api);
var port = process.env.PORT || 1337;

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(500, {
    error: err.message
  });
});

app.listen(port, function() {
  console.log('Server running at http://127.0.0.1:' + port);
});

/*
// Get and update static data at server start, and daily.
staticData.updateChampionData();
staticData.updateItemData();
setInterval(function() {
	staticData.updateChampionData();
	staticData.updateItemData();
}, 86400 * 1000);
*/
