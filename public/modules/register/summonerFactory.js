'use strict';

angular.module('SummonerFactory')

.factory('getSummonerData', ['$http', '$rootScope',function($http, $rootScope) {
  return {
    list: function(callback)
    {
      $http({
        method: 'POST',
        url: './Scripts/checkSummoner.php',
        data: $.param(
          {
          'summonername' : $rootScope.globals.registeringUser.summonername
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).success(callback);
    }
  };
}]);
