'use strict';

angular.module('Find')

.controller('FindController', ['$scope', '$location', function ($scope, $location) {

	$scope.goTournament = function() {
		$location.path('/tournament');
	}

	$scope.tournaments = [];
	if (_.isEmpty($scope.tournaments)) {
		for (var i = 0; i < 500; i++) {
			var Tmax = 40;
			var Tmin = 4;
			var Pmax = 100;
			var Pmin = 10;
			var Omax = 19;
			var Omin = 1;
			var Nmax1 = 123;
			var Nmin1 = 1;
			var Nmax2 = 231;
			var Nmin2 = 1;
			var Rmin = 0;
			var Rmax = 10;
			var Summoners = [];
			var Names = ["Armand","Lisandra","Gareth","Joan","Miranda","Cleo","Wyoming","Maia","Shelby","Eric","Claudia","Marsden","Grace","Tashya","Silas","Omar","Rina","Elton","Althea","Harriet"];
			var Champions = ["Aatrox","Ahri","Akali","Alistar","Amumu","Anivia","Annie","Ashe","Azir","Blitzcrank","Brand","Braum","Caitlyn","Cassiopeia","Cho'Gath","Corki","Darius","Diana","Dr. Mundo","Draven","Elise","Evelynn","Ezreal","Fiddlesticks","Fiora","Fizz","Galio","Gangplank","Garen","Gnar","Gragas","Graves","Hecarim","Heimerdinger","Irelia","Janna","Jarvan IV","Jax","Jayce","Jinx","Kalista","Karma","Karthus","Kassadin","Katarina","Kayle","Kennen","Kha'Zix","Kog'Maw","LeBlanc","Lee Sin","Leona","Lissandra","Lucian","Lulu","Lux","Malphite","Malzahar","Maokai","Master Yi","Miss Fortune","Mordekaiser","Morgana","Nami","Nasus","Nautilus","Nidalee","Nocturne","Nunu","Olaf","Orianna","Pantheon","Poppy","Quinn","Rammus","Rek'Sai","Renekton","Rengar","Riven","Rumble","Ryze","Sejuani","Shaco","Shen","Shyvana","Singed","Sion","Sivir","Skarner","Sona","Soraka","Swain","Syndra","Talon","Taric","Teemo","Thresh","Tristana","Trundle","Tryndamere","Twisted Fate","Twitch","Udyr","Urgot","Varus","Vayne","Veigar","Vel'Koz","Vi","Viktor","Vladimir","Volibear","Warwick","Wukong","Xerath","Xin Zhao","Yasuo","Yorick","Zac","Zed","Ziggs","Zilean","Zyra"];
			var ChampionTypes = ["Academy","Adepts","Adventurers","Agents","Alchemists","Alliance","Allies","Ambassadors","Amethysts ","Apprentices","Archangels","Archers","Archons","Army","Arrows","Arsenal","Artillery","Ascended","Assassins","Avatars","Avengers","Backstabbers","Bandits","Banshees","Barbarians","Barracudas","Bats","Battlemasters","Bears","Beasts","Berserkers","Blackguards","Blades","Blightlords","Bloodthirsters","Brave","Brigade","Brigands","Brood","Brotherhood","Brutes","Buddies","Butchers","Captains","Cavaliers","Cavalry","Chains","Cheetahs","Chimeras","Chosen","Clan","Cobras","Colossi","Commanders","Commandos","Conquerors","Constellations","Corruptors","Council","Crusaders","Crushers","Curse","Cutthroats","Cyclops","Daggers","Darkness","Dawnbringers","Deceivers","Defiants","Demolishers","Dervish","Destiny","Destroyers","Disciples","Doom","Dragons","Dragoons","Dreadborne","Duelists","Eagles","Elementalists","Elite","Emeralds","Emmissaries","Enforcers","Enlightened","Executioners","Exemplars","Fighters","Fists","Flames","Foxes","Fury","Gadgeteers","Giants","Gladiators","Gryphons","Guardians","Guild","Harbingers","Hawks","Heralds","Heroes","Highborn","Highwaymen","Horde","Host","Hunters","Hurricane","Iceborn","Infantry","Infiltrators","Inquisitors","Jackals","Judicators","Justicars","Knights","Lancers","Legends","Legion","Liberators","Lifedrinkers","Light","Lightbringers","Lightnings","Lions","Lords","Magi","Marauders","Marksmen","Masterminds","Maulers","Mercenaries","Messengers","Minotaurs","Monks","Musketeers","Necromancers","Ninjas","Omen","Opals","Oracles","Outlaws","Outriders","Overlords","Owls","Paladins","Panthers","Paragons","Patriots","Pearls","Phantoms","Pirates","Poisoners","Privateers","Protectors","Pumas","Pyromancers","Rageborn","Rangers","Ravagers","Ravens","Reapers","Redeemers","Regiment","Renegades","Ritualists","Rogues","Runemasters","Sapphires","Scimitars","Scions","Scorpions","Scouts","Sentinels","Sentries","Shadehunters","Shadowdancers","Shadows","Shamans","Sharks","Sheriffs","Shields","Slayers","Snipers","Soldiers","Song","Sorcerers","Spellbreakers","Spellslingers","Spellswords","Spies","Stags","Stalkers","Standard","Storm","Strategists","Summoners","Swarm","Swasbucklers","Swashbucklers","Templars","Thieves","Tigers","Tornadoes","Tricksters","Troops","Tyrants","Urfriders","Vampires","Vanguards","Vengeance","Veterans","Vigilantes","Villains","Vindicators","Voidlings","Vultures","Wardens","Warlocks","Warlords","Warmongers","Warriors","Weaponmasters","Weapons","Wisemen","Witch Hunters","Wizards","Wraiths","Zealots","Zephyrs"];
			$scope.tournaments.push({
				name: Champions[Math.floor((Math.random() * ((Nmax1 + 1) - Nmin1)) + Nmin1)] + "'s " + ChampionTypes[Math.floor((Math.random() * ((Nmax2 + 1) - Nmin2)) + Nmin2)],
				teamCount: Math.floor((Math.random() * ((Tmax + 1) - Tmin)) + Tmin),
				owner: Names[Math.floor((Math.random() * ((Omax + 1) - Omin)) + Omin)],
				progress: Math.floor((Math.random() * ((Pmax + 1) - Pmin)) + Pmin),
				rules: Math.floor((Math.random() * ((Rmax + 1) - Rmin)) + Rmin)
			})
		}
	}

}]);
