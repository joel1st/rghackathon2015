var express = require('express');
var app = express();

var router = express.Router();
var uuid = require('node-uuid');
var passport = require('passport');
var os = require('os');
var config = require('../config.js');
var riot = require('../riot/riot.js');
var providers = require('../models/providers.js');
var tournaments = require('../models/tournaments.js');
// api -------------------------
router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.send("Hello");
    //res.redirect('/users/' + req.user.username);
  });
/* 
Send whatever data is needed 
for signup to front end 
(split into multiple endpoints if needed.)
*/
router.route('/create_tournament')
	.post(function(req, res) {
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
						}
					});
					data.success = true;
				} else {
					data.success = false;
				}
				res.json(data);
			});
			return;
		}
		// data is ready now
		res.json(data);
	});

router.route('/filters')
	.get(function(req, res) {
		res.send('filters');
	});



router.route('/generate')
	.get(function(req, res) {
		res.send('generate');
	});

// Generate a callback
router.route('/generate_callback')
	.get(function(req, res) {
		res.send(uuid.v1());
	});

module.exports = router;
