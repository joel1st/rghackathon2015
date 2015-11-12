var responses = {
	"429": {
		message: "Rate Limit Exceeded"
	},
	"404": {
		message: "Not found"
	},
	"500": {
		message: "Error with Riot's Server"
	}
};

module.exports = function parseResponse(err, response, body, queryOptions){
	if(err) {
		console.log("Error: " + err);
		queryOptions.callback(err, {'message': err.message});
	}
	else if (response.statusCode === 200) {
		queryOptions.callback(null, JSON.parse(body));
	}
	else {
		queryOptions.callback(response.statusCode, {'status_code': response.statusCode, 'message': responses[response.statusCode].message});
	}
}