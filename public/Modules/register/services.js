'use strict';

angular.module('Register')

.factory('RegisterService', ['$http', function($http) {
  var service = {};

  service.CheckSummoner = function(summonername, callback) {
    $http.post('./Scripts/checkSummoner.php', {summonername: summonername})
    .success(function(response) {
      callback(response);
    });
  };

  service.AddUser = function(user) {
    return $http.post('./Scripts/tryToRegister.php', {user:user});
  };

  return service;
}]);
