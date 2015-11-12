var request = require('request');
var queue = require('queue');
var responseHandler = require('./response_handler.js');
var config = require('../config.js');

var providers = require('../models/providers.js');

var protocol = "https://";
var	baseUrl = "global.api.pvp.net/tournament/public/v1/";
var codeEndpoint = baseUrl + "code/";
var tournamentEndpoint = baseUrl + "tournament/";
var providerEndpoint = baseUrl + "provider/";
var lobbyEventsEndpoint = baseUrl + "lobby/events/by-code/";

var	key = config.apiKey;

var	retryAfter = 0;
var	summonerRetryAfter = 0;

var queue = queue();
queue.concurrency = 10;


// Ask Rito for data
function GET(options) {
	queue.push(function(done){

		request.get({
			headers: {'x-riot-token' : key},
			url: options.url,
		}, function(err, response, body) {
			responseHandler(err, response, body, options);
			done();
		});

	});

	// This will start the queue if it isn't already started.
	queue.start();
}


function POST(options) {
	queue.push(function(done){

		request.post({
			headers: {'x-riot-token' : key},
			url:     options.url,
			body:    option.body
		}, function(error, response, body){
			responseHandler(err, response, body, options);
			done();

		});
	});

	// This will start the queue if it isn't already started.
	queue.start();
}

module.exports = {

	// Get summoner by name
	getTournamentCode: function(tournamentCode, callback) {
			var url = protocol + codeEndpoint + tournamentCode;
			GET({
				url: url,
				callback: callback
			});
	},

	postProviderIds: function(region, callback) {
			var url = protocol + providerEndpoint;

			var supported = config.supportedRegions;
			
			POST({
				url: url,
				body: {
					url:config.callbackUrl,
					region: region
				},
				callback: function(err, response){
					if(!err){
						var provider = new providers({
							region: region,
							providerId: response.body
						});
						provider.save(function(err, saved){
							if(!err && saved){
								callback(null, response.body);
							}
						});
					}
					
				}
			});

				
			
	},

	postProvider: function(region, url) {
		var url = protocol + providerEndpoint;
		POST({
			body: 'create a body',
			url: url,
			callback: callback
		});
	}

};