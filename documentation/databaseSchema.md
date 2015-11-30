Tournament
	_id
	tournamentId(from rito) 
	region
	ownerId 
	name
	pickType
	mapType
	spectatorType
	bracketType
	teamSize
	visibility
	signUps
	signUpDeadline
	maxTeams
	created
	filters
		[
		filterId
		parameters
			[
				key => value,
				key => value
			]
		]
	teams
		[
		teamId
		]

Game
	_id
	tournamentId
	gameCode
	redTeam
	blueTeam
	finished
	winner
	disqualification
	failedFilters	
		[
			filterId
			reason 
				[
					team
					summonerId
				]
		]

Team
	_id
	name
	tag
	captain
	region
	members
		summonerId
		name
		captain
	tournaments
		[
		_id
		]

Account
	_id
	email
	password

Filter
	_id
	type
	name
