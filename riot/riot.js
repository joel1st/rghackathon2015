var request = require('request');
var queue = require('queue');
var responseHandler = require('./response_handler.js');
var config = require('../config.js');

var providers = require('../models/providers.js');
var tournaments = require('../models/tournaments.js');
var games = require('../models/games.js');

var protocol = "https://";
var baseTournamentUrl = "global.api.pvp.net/tournament/public/v1/";
var baseStaticDataUrl = "global.api.pvp.net/api/lol/static-data/na/v1.2/";

var codeEndpoint = baseTournamentUrl + "code";
var tournamentEndpoint = baseTournamentUrl + "tournament/";
var providerEndpoint = baseTournamentUrl + "provider/";
var lobbyEventsEndpoint = baseTournamentUrl + "lobby/events/by-code/";

var matchUrl = '.api.pvp.net/api/lol/';
var matchEndpoint = '/v2.2/match/';
var summonerEndpoint = '/v1.4/summoner/by-name/';
var matchByTournamentEndpoint = "by-tournament/";

var q = require('q');


var key = config.apiKey;

var retryAfter = 0;
var summonerRetryAfter = 0;

var queue = queue();
queue.concurrency = 10;


// Ask Rito for data
function GET(options) {
    queue.push(function(done) {

        request.get({
            headers: {
                'x-riot-token': key
            },
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
    queue.push(function(done) {

        request.post({
            headers: {
                'x-riot-token': key
            },
            url: options.url,
            json: options.body
        }, function(err, response, body) {
            responseHandler(err, response, body, options);
            done();

        });
    });

    // This will start the queue if it isn't already started.
    queue.start();
}

module.exports = {


    getTournamentCode: function(tournamentCode, callback) {
        var url = protocol + codeEndpoint + '/' + tournamentCode;
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
                url: config.callbackUrl,
                region: region
            },
            callback: function(err, response) {
                if (!err) {
                    var provider = new providers({
                        region: region,
                        providerId: response
                    });
                    provider.save(function(err, saved) {
                        if (!err && saved) {
                            callback(null, response);
                        } else {
                            callback(err, saved);
                        }
                    });
                }

            }
        });
    },

    createTournament: function(name, providerId, callback) {
        var url = protocol + tournamentEndpoint;
        POST({
            url: url,
            body: {
                name: name,
                providerId: providerId
            },
            callback: function(err, response) {
                if (!err) {
                    var tournament = new tournaments({
                        tournamentId: response
                    });
                    tournament.save(function(err, saved) {
                        if (!err && saved) {
                            callback(null, response);
                        } else {
                            callback(err, response);
                        }
                    });
                }
            }
        });
    },

    getMatch: function(matchId, region, includeTimeline, callback) {
        var url = protocol + region.toLowerCase() + matchUrl + region.toLowerCase() + matchEndpoint + matchId + "?includeTimeline=" + includeTimeline;
        GET({
            url: url,
            callback: callback
        });
    },

    /*
		Gets summoner data for an array of summoner names
	*/
    getSummonersByName: function(region, summonerNames, callback) {
        var url = protocol + region.toLowerCase() + matchUrl + region.toLowerCase() + summonerEndpoint;
        for (var i = 0; i < summonerNames.length; i++) {
            url += summonerNames[i] + ',';
        }
        console.log(url);
        GET({
            url: url,
            callback: callback
        });
    },

    createCode: function(tournamentId, count, region, callback) {
        if (tournamentId === null) {
            callback({
                "message": "Tournament ID doesn't exist."
            }, null);
            return;
        }
        if (count > 1000 && count < 1) {
            callback({
                "message": "Incorrect count amount."
            }, null);
            return;
        }
        var url = protocol + codeEndpoint + "?tournamentId=" + tournamentId + "&count=" + count;

        tournaments.findOne({
                'tournamentId': tournamentId
            }, function(err, data) {
                if (err) {
                    console.error('Error: ' + err);
                } else {
                    POST({
                        url: url,
                        body: {
                            teamSize: data.teamSize,
                            spectatorType: data.spectatorType,
                            pickType: data.pickType,
                            mapType: data.mapType,
                            metadata: '' //{'region' : data.region, 'tournamentId' : data.tournamentId}
                        },
                        callback: function(err, response) {
                            if (!err) {
                                var savedGames = [];
                                var promiseArr = [];

                                var saveGames = function(i) {
                                    var deferred = q.defer();
                                    var game = new games({
                                        gameId: response[i]
                                    });

                                    game.save(function(err, saved) {

                                        if (!err && saved) {
                                            deferred.resolve();
                                            savedGames.push(response[i]);
                                        }
                                    });
                                    return deferred.promise;
                                };

                                for (var i = 0; i < response.length; i++) {

                                    promiseArr.push(saveGames(i));

                                }

                                q.all(promiseArr).then(function() {
                                    callback(null, savedGames);
                                });
                            }
                               
                        }
                    });
                }
        });
    },

    getMatchIdsByTournament: function(region, tournamentCode, callback) {
        var url = protocol + region + matchUrl + region + matchEndpoint +
            matchByTournamentEndpoint + tournamentCode + '/ids?api_key=' + config.apiKey;
        GET({
            url: url,
            callback: callback
        });
    },

    getItemData: function(callback) {
        var url = protocol + baseStaticDataUrl + 'item?itemListData=all&api_key=' + config.apiKey;
        GET({
            url: url,
            callback: callback
        });
    },

    getChampionData: function(callback) {
        var url = protocol + baseStaticDataUrl + 'champion?champData=all&api_key=' + config.apiKey;
        GET({
            url: url,
            callback: callback
        });
    }

};