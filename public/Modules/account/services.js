'use strict';

angular.module('Account')

.factory('AccountService', ['$http', '$rootScope', '$cookieStore', function($http, $rootScope, $cookieStore) {
  var service = {};

  service.CheckAdmin = function(callback) {
    $http.post('./Scripts/checkAdmin.php', {
        username: $rootScope.globals.currentUser.username,
        password: $rootScope.globals.currentUser.password
      })
      .success(function(response) {
        if (response.success) {
          $rootScope.globals.currentUser.officer = 1;
          $cookieStore.put('globals', $rootScope.globals);
        }
        callback(response);
      });
  };

  service.EditInfo = function(id, name, summoner, email, twitch, description, callback) {
    $http.post('./Scripts/editInfo.php', {
        id: id,
        name: name,
        summoner: summoner,
        email: email,
        twitch: twitch,
        description: description
      })
      .success(function(response) {
        callback(response);
      });
  };

  service.EditChampRole = function(id, champ1, champ2, champ3, role1, role2, callback) {
    $http.post('./Scripts/editChampRole.php', {
        id: id,
        champ1: champ1,
        champ2: champ2,
        champ3: champ3,
        role1: role1,
        role2: role2
      })
      .success(function(response) {
        callback(response);
      });
  };

  service.EditElo = function(id, elo, s1, s2, s3, s4, callback) {
    $http.post('./Scripts/editElo.php', {
        id: id,
        elo: elo,
        s1: s1,
        s2: s2,
        s3: s3,
        s4: s4
      })
      .success(function(response) {
        callback(response);
      });
  };

  return service;
}]);
