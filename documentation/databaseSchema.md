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
					team
					summonerId
					// depending on filter
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

Users
	_id
	email
	password

Filter
	_id
	type
	name
