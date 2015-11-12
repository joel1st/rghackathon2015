var express = require('express');
var app = express();

var router = express.Router();
var uuid = require('node-uuid');
var passport = require('passport');
var os = require('os');

// api -------------------------
router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    res.send("Hello");
    //res.redirect('/users/' + req.user.username);
  });

module.exports = router;