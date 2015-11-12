var riot = require('../riot/riot.js');

module.exports = {
	filters: ["No Wards Allowed"],

/*  Check for ward placed events in data
	and return an object with the following properties:
		valid - false when a team is disqualified for not following the rules.
		team - number of team participant was on.
*/
checkForWards: function(json) {
	var teams = getParticipantTeams(json);
	timelineData = json.timeline.frames;
	for(var i = 0; i < timelineData.length; i++) {
		if(timelineData[i].events) {
			var events = timelineData[i].events;
			for(var j = 0; j < events.length; j++) {
				if(events[j].eventType === 'WARD_PLACED') {
					var creator = events[j].creatorId;
					if(teams['100'].indexOf(creator) > -1) {
						return {valid: false, team: 1};
					} else if(teams['200'].indexOf(creator > -1)) {
						return {valid: false, team: 2};
					}
				}
			}
		}
	} return {valid: true, team: 0};
}

};

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
