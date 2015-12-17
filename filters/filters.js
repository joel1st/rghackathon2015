var riot = require('../riot/riot.js');

module.exports = {
	filters: ["No Wards Allowed"],
	checkForWards: checkForWards,
	filterToFunction: filterToFunction
};

// FILTERS NEED TO PROVIDE A TIMESTAMP AND VALID FIELD AND TEAM (element of {100, 200})

/*  Check for ward placed events in data. parameters is ignored.
	and return an object with the following properties:
		valid - false when a team is disqualified for not following the rules.
		team - number of team participant was on.
*/
function checkForWards(json, parameters) {
	var teams = getParticipantTeams(json);
	timelineData = json.timeline.frames;
	for(var i = 0; i < timelineData.length; i++) {
		if(timelineData[i].events) {
			var events = timelineData[i].events;
			for(var j = 0; j < events.length; j++) {
				if(events[j].eventType === 'WARD_PLACED') {
					var creator = events[j].creatorId;
					if(teams['100'].indexOf(creator) > -1) {
						return {valid: false, team: 100, timestamp: events[j].timestamp};
					} else if(teams['200'].indexOf(creator > -1)) {
						return {valid: false, team: 200, timestamp: events[j].timestamp};
					}
				}
			}
		}
	} return {valid: true, team: 0, timestamp: 0};
}


// Map mapping from the filter type to the check function
var filterToFunction = new Array();
filterToFunction["NO_WARD"] = checkForWards;
/* Create an object, organizing participants to their respective teams.
	Team 1 = 100
	Team 2 = 200
*/
function getParticipantTeams(json) {
	var data = {'100': [], '200': []};
	if(json.participants) {
		for(var i = 0; i < json.participants.length; i++) {
			var participant = json.participants[i];
			data[participant.teamId].push(participant.participantId);
		}
	} return data;
}
