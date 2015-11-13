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

var tournaments = require('./models/tournaments.js');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var passport = require('passport');

app.use(bodyParser.json({limit: '2kb', extended: true}));
app.use(bodyParser.urlencoded({limit: '2kb', extended: true}));

//app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(getProviders);

app.use(express.static(path.join(__dirname, 'public')));

//app.use(flash()); // use connect-flash for flash messages stored in session
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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

// API to communicate with frontend
app.post('/', function(req, res, next) {
	console.log(req.body);
	riot.getMatch(req.body.gameId, 'NA', true, function(err, data) {
		if(!err) {
			filters.checkForWards(data);
		}
 	});
	res.send(200, 'thanks for that sweet sweet data riot');
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
