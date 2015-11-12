var request = require('request');

var protocol = "https://";
var	baseUrl = "global.api.pvp.net/tournament/public/v1/";
var codeEndpoint = baseUrl + "code";
var tournamentEndpoint = baseUrl + "tournament";
var providerEndpoint = baseUrl + "provider";
var lobbyEventsEndpoint = baseUrl + "lobby/events/by-code"

var	key = "08da07b1-45b3-4b33-bc52-12a68e2af68e";

var	retryAfter = 0;
var	summonerRetryAfter = 0;

module.exports = {

	// Get summoner by name
	getTournamentCode: function(tournamentCode) {
			var url = protocol + codeEndpoint;
			GET(url, callback);
	},

	postProvider: function(region, url) {
		var url = protocol + providerEndpoint;
		POST(url, callback);
	}

};

// Ask Rito for data
function GET(url, endpoint, callback) {
	request.get({
		headers: {'x-riot-token' : key},
		url: url,
	}, function(err, response, body) {
		if(err) {
			console.log("Error: " + err);
			callback(123, {'status_code': 123, 'message': 'Request Error'});
		}
		else if(response.statusCode === 200) {
			callback(response.statusCode, JSON.parse(body));
		}
		else if(response.statusCode === 429) {
			callback(response.statusCode, {'status_code': response.statusCode, 'message': 'Rate Limit Exceeded'});
		}
		else {
			callback(response.statusCode, {'status_code': response.statusCode, 'message': 'Something went wrong.'});
		}
	});


	function POST(url, body)	{
		request.post({
  			headers: {'x-riot-token' : key},
  			url:     url,
  			body:    body
	}, function(error, response, body){
  		console.log(body);
	});
	};
}