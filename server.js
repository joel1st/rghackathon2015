var http = require('http');
var db = require('./db.js');
var express = require('express');
var app = express();
var morgan = require('morgan');
var api = require('./api/api.js');
var riot = require('./riot/riot.js');
var getProviders = require('./middleware/get_providers.js');

var tournaments = require('./models/tournaments.js');
var Users = require('./models/users.js');

var bodyParser = require('body-parser');
var passport = require('passport');
app.use(bodyParser.json({limit: '2kb', extended: true}));
app.use(bodyParser.urlencoded({limit: '2kb', extended: true}));

//app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

app.use(getProviders);

// API to communicate with frontend
app.use('/api', api);

Users.update({username : 'username', password: 'password'}, {username : 'username', password: 'password'}, {upsert: true}, function(err, data) {
	if(!err) {
		console.log(data);
	}
});

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    Users.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password, user.password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

// riot.getTournamentCode('NA0416f-855d1cb4-b35f-4e3c-9e1a-566147c0260b', function(){
// 	console.log(arguments);	
// });

app.get('/', function(req, res) {
	res.sendFile('public/index.html', {'root' : __dirname});
});

app.listen(1337, function() {
	console.log('Server running at http://127.0.0.1:1337/');
});
