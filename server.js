var http = require('http');
var db = require('./db.js');
var express = require('express');
var app = express();
var morgan = require('morgan');
var api = require('./api/api.js');
var riot = require('./riot/riot.js');
var config = require('./config.js');
var q = require('q');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));

var providers = require('./models/providers.js');


function checkForProvider(req, res, region){
	var deferred = q.defer();
	providers.findOne({'region': supported[i]}, function(err, data){
		if(!req.providers){
			req.providers = {};
		}

		if(err || !data){
			riot.postProviderIds(supported[i], function(err, providerId){
				req.providers[supported[i]] = providerId;
			});

		} else {
			req.providers[supported[i]] = data.providerId;

		}
		deferred.resolve();
	});

	return deferred.promise;
}


app.use(function(req, res, next){
	console.log("!!!!")
	var supported = config.supportedRegions;
	var arrayOfProviders = [];
	console.log('supp', supported);
	for(var i = 0; i < supported.length; i++){	
		console.log('inside the array');
		arrayOfProviders.push(checkForProvider(req, res, supported[i]));

	}

	q.all(arrayOfProviders).then(function(){
		next();
	})
	.done();

});

// API to communicate with frontend
app.use('/api', api);

// riot.getTournamentCode('NA0416f-855d1cb4-b35f-4e3c-9e1a-566147c0260b', function(){
// 	console.log(arguments);	
// });

app.get('/', function(req, res) {
	res.sendFile('public/index.html', {'root' : __dirname});
});

app.listen(1337, function() {
	console.log('Server running at http://127.0.0.1:1337/');
});