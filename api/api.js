var express = require('express');
var app = express();

var router = express.Router();
var uuid = require('node-uuid');
var os = require('os');

// api -------------------------
/* 
Send whatever data is needed 
for signup to front end 
(split into multiple endpoints if needed.)
*/
router.route('/create_tournament')
	.post(function(req, res) {
		var data = {};
		if(req.body.owner != '') {
			data.success = false;
		} else {
			data.success = true;
		} res.json(data);

		res.send('signup');
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