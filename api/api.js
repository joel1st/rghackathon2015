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

// api -------------------------

// Get notification from Riot when game ends
router.post('/riot_notification', function(req, res, next) {
	console.log(res.body);
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.post('/register',  function(req, res, next) {
	console.log(req, res);
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
    	console.log(req.body, err, account);
        if (err) {
          return res.send({info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
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
			data.message = "Invalid Tournament name";		
		} else { // all cool now
			// so request it from the riot api
			providers.findOne({'region': req.body.region}, function(err, response) {	
				var data = {};
				if (!err) {
					riot.createTournament(req.body.name, response.providerId, function(err, response) {
						if (!err) {
							// update the correct item
							tournaments.update({"tournamentId": response}, {"spectatorType": req.body.spectatorType, "pickType": req.body.pickType, "mapType": req.body.mapType, "teamSize": req.body.teamSize, "name": req.body.name}, function (err, numAffected) {});
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

router.get('/filters', function(req, res) {
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
