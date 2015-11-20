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
	public
	signUps
	signUpDeadline
	maxTeams
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
					// depending on filter
				]
		]

Team
	_id
	name
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

Users
	_id
	email
	password

Filter
	_id
	type
	name
