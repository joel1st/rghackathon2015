'use strict';

angular.module('Create')

.controller('CreateController', ['$scope', '$http', '$timeout', '$location', function ($scope, $http, $timeout, $location) {

	$scope.messages = {};
	$scope.users = new Array(12);
  $scope.regions = ['NA', 'BR', 'EUNE', 'EUW', 'KR', 'RU','LAN','OCE', 'TR'];		
  $scope.comparators = ['>', '=', '<'];
  $scope.message = {
  	step1: 'Please sign up so we can keep track of your tournament',
  	step2: 'Select your tournament preferences',
  	step3: 'Specify additional rules and filters for your tournament'
  };

  $scope.maps = [{
  	name: 'Summoners Rift',
  	value: 'SUMMONERS_RIFT'
  }, 
  {
  	name: 'Crystal Scar',
  	value: 'CRYSTAL_SCAR'
  }, 
  {
  	name: 'Howling Abyss',
  	value: 'HOWLING_ABYSS'
  }
  ];

  $scope.picks = [{
  	name: 'Blind Pick',
  	value: 'BLIND_PICK'
  }, 
  {
  	name: 'Draft Mode',
  	value: 'DRAFT_MODE'
  },
  {
  	name: 'All Random',
  	value: 'ALL_RANDOM'
  },
  {
  	name: 'Tournament Draft',
  	value: 'TOURNAMENT_DRAFT'
  }
  ];

  $scope.spectators = [{
  	name: 'None',
  	value: 'NONE'
  }, 
  {
  	name: 'Lobby Only',
  	value: 'LOBBYONLY'
  },
  {
  	name: 'All',
  	value: 'ALL'
  }
  ];

  $scope.players = [{
  	name: 'One',
  	value: '1'
  }, 
  {
  	name: 'Two',
  	value: '2'
  }, 
  {
  	name: 'Three',
  	value: '3'
  }, 
  {
  	name: 'Four',
  	value: '4'
  }, 
  {
  	name: 'Five',
  	value: '5'
  }
  ];

  $scope.visibilities = [{
  	name: 'Public',
  	value: 'Public'
  }, 
  {
  	name: 'Private',
  	value: 'Private'
  }
  ];

  $scope.filters = [{
    championmastery: {
      id: 'championmastery',
      name: 'Champion Mastery',
      status: true,
      settings: {
        championlevel: 5,
        comparator: $scope.comparators[0]
      }
    },
    itemrestrictions: {
      id: 'itemrestrictions',
      name: 'Item Restrictions',
      status: false,
      settings: {
        items: ''
      }
    },
    champrestrictions: {
      id: 'champrestrictions',
      name: 'Champ Restrictions',
      status: false,
    },
    nowards: {
      id: 'nowards',
      name: 'No Warding',
      status: false,
    },
    role: {
      id: 'role',
      name: 'Role Only',
      status: false,
    },
    summonerSpell: {
      id: 'summonerspell',
      name: 'Summoner Spells',
      status: false,
    }, 
    conditions: {
	id:'conditions',
	name: 'Winconditions',
	status: false,
    }
  }];

	if (!$scope.users.length) {
			$scope.users.push('');
	}

  $scope.newTournament = {
  	owner: '',
  	settings: {
  		name: '',
  		region: $scope.regions[0],
  		teamSize: $scope.players[0].value,
  		pickType: $scope.picks[0].value,
  		mapType: $scope.maps[0].value,
  		spectatorType: $scope.spectators[0].value,
  		visibility: $scope.visibilities[0].value
  	},
  	users: $scope.users,
  	filters: $scope.filters
  };

  $scope.step1 = true;

  $scope.newUser = function() {
  	var anyEmpty = false;
  	_.each($scope.users, function(user) {
  		if (_.isEmpty(user)) {
  			anyEmpty = true;
  			return;
  		}
  	});

  	if (!anyEmpty) {
  		$scope.users.push('');
  	}
  }

  $scope.submitStep1 = function() {
  	$scope.step1LoginSpinner = true;
  	$scope.messages = {};
    $http({
    	url:"/api/login", 
    	method: 'POST',
    	data: {
        'username': $scope.newTournament.owner,
        'password': $scope.newTournament.password
    	}
    	})
    .success(function(result) {
      $scope.step1 = false;
  		$scope.step2 = true;
    })
    .error(function(result) {
    	$scope.messages.error = result;
        console.log(result);
    })
    .finally(function(result) {
        $scope.step1LoginSpinner = false;
    })
  }

  $scope.step1Register = function() {
  	$scope.step1RegisterSpinner = true;
  	$scope.messages = {};
    $http({
    	url:"/api/register", 
    	method: 'POST',
    	data: {
        'username': $scope.newTournament.owner,
        'password': $scope.newTournament.password
    	}
    	})
    .success(function(result) {
      $scope.step1 = false;
  		$scope.step2 = true;
    })
    .error(function(result) {
    	$scope.messages.error = result.error;
        console.log(result);
    })
    .finally(function(result) {
        $scope.step1RegisterSpinner = false;
    })
  }

  $scope.submitStep2 = function() {
  	$scope.step2 = false;
  	$scope.step3 = true;
  }

  $scope.submitStep3 = function() {
  	console.log($scope.newTournament);
  	$scope.step3RedirectSpinner = true;

  	$scope.messages = {};
    $http({
    	url:"/api/create_tournament", 
    	method: 'POST',
    	data: $scope.newTournament.settings
    	})
    .success(function(result) {
      $scope.step3 = false;
  		$scope.step4 = true;
  		$timeout(function() { 
  			$location.path('/tournament');
  			$scope.step3RedirectSpinner = false;
  		}, 2000);
    })
    .error(function(result) {
    	$scope.messages.error = result.error;
        console.log(result);
    })
    .finally(function(result) {
    })
  }

}]);
