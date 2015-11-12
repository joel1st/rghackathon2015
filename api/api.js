var express = require('express');
var app = express();

var router = express.Router();
var uuid = require('node-uuid');
var passport = require('passport');
var Account = require('../models/account');
var os = require('os');

// api -------------------------
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



module.exports = router;