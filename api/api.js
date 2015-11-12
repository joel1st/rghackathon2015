var express = require('express');
var app = express();

var router = express.Router();
var os = require('os');

// api -------------------------
router.get('/test_login',
	function(req, res){
		res.send('Hello');
	});
module.exports = router;