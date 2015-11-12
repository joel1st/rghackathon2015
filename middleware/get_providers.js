var config = require('../config.js');
var riot = require('../riot/riot.js');
var q = require('q');
var providers = require('../models/providers.js');

function checkForProvider(req, res, region){
	var deferred = q.defer();
	providers.findOne({'region': region}, function(err, data){
		if(!res.locals.providers){
			res.locals.providers = {};
		}

		if(err || !data){
			riot.postProviderIds(region, function(err, providerId){
				cachedProviders = res.locals.providers[region] = providerId;
			});

		} else {

			cachedProviders = res.locals.providers[region] = data.providerId;

		}
		deferred.resolve();
	});

	return deferred.promise;
}

var cachedProviders;

module.exports = function(req, res, next){
	if(cachedProviders){
		console.log('cache is hit');
		next();
	} else {
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
	}
	
};