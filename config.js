module.exports = {
	apiKey: process.env.API_KEY || '8c40e17c-483a-4554-bdb2-60244bc49931',
	db: {
		name: process.env.DB_NAME || 'rghackathon2015'
	},
	callbackUrl: "https://tournamentgg.herokuapp.com",
	supportedRegions: ['NA'],
	pickTypes: ['DRAFT_MODE', 'BLIND_PICK', 'ALL_RANDOM', 'TOURNAMENT_DRAFT'],
	spectateTypes: ['ALL', 'NONE', 'LOBBYONLY'],
	mapTypes: ['SUMMONERS_RIFT', 'CRYSTAL_SCAR', 'HOWLING_ABYSS'],
	resultTypes: ['BLUE_WIN', 'RED_WIN', 'BLUE_DISQ', 'RED_DISQ', "TBD"]
};
