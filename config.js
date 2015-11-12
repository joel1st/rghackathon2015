module.exports = {
	apiKey: process.env.API_KEY || '08da07b1-45b3-4b33-bc52-12a68e2af68e',
	db: {
		name: process.env.DB_NAME || 'rghackathon2015'
	},
	supportedRegions: ['NA'],
	pickTypes: ['DRAFT_MODE', 'BLIND_PICK', 'ALL_RANDOM', 'TOURNAMENT_DRAFT'],
	spectateTypes: ['ALL', 'NONE', 'LOBBYONLY'],
	mapTypes: ['SUMMONERS_RIFT', 'CRYSTAL_SCAR', 'HOWLING_ABYSS'],
	resultTypes: ['BLUE_WIN', 'RED_WIN', 'BLUE_DISQ', 'RED_DISQ']
};
