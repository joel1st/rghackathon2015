var responses = {
	"429": {
		message: "Rate Limit Exceeded"
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