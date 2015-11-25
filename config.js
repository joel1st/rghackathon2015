module.exports = {
	apiKey: process.env.API_KEY || 'API-KEY-HERE',
	db: {
		name: process.env.DB_NAME || 'rghackathon2015'
	},
	callbackUrl: "http://tournamentgg.herokuapp.com",
	supportedRegions: ['NA'],
	pickTypes: ['DRAFT_MODE', 'BLIND_PICK', 'ALL_RANDOM', 'TOURNAMENT_DRAFT'],
	spectateTypes: ['ALL', 'NONE', 'LOBBYONLY'],
	mapTypes: ['SUMMONERS_RIFT', 'CRYSTAL_SCAR', 'HOWLING_ABYSS'],
	resultTypes: ['BLUE_WIN', 'RED_WIN', 'BLUE_DISQ', 'RED_DISQ', "TBD"]
};
