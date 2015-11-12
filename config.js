module.exports = {
	apiKey: process.env.API_KEY || '08da07b1-45b3-4b33-bc52-12a68e2af68e',
	db: {
		name: process.env.DB_NAME || 'rghackathon2015'
	},
	callbackUrl: "http://ec2-52-34-5-247.us-west-2.compute.amazonaws.com/",
	supportedRegions: ['NA'],
	pickTypes: ['DRAFT_MODE', 'BLIND_PICK', 'ALL_RANDOM', 'TOURNAMENT_DRAFT'],
	spectateTypes: ['ALL', 'NONE', 'LOBBYONLY'],
	mapTypes: ['SUMMONERS_RIFT', 'CRYSTAL_SCAR', 'HOWLING_ABYSS'],
	resultTypes: ['BLUE_WIN', 'RED_WIN', 'BLUE_DISQ', 'RED_DISQ', "TBD"]
};
