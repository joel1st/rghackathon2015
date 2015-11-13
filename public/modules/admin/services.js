'use strict';

angular.module('Admin')

.factory('AdminService', ['$http', '$rootScope', '$cookieStore', function($http, $rootScope, $cookieStore) {
  var service = {};

  service.DeleteUser = function(id,callback) {
    $http.post('./Scripts/deleteUser.php', {
        id:id,
        username: $rootScope.globals.currentUser.username,
        officer: $rootScope.globals.currentUser.officer
      })
      .success(function(response) {
        callback(response);
      });
  };

  service.PasswordUser = function(id,password,callback) {
    $http.post('./Scripts/passwordUser.php', {
        id:id,
        password:password,
        username: $rootScope.globals.currentUser.username,
        officer: $rootScope.globals.currentUser.officer
      })
      .success(function(response) {
        console.log(response);
        callback(response);
      });
  };

  service.EditUser = function(user,callback) {
    $http.post('./Scripts/editUser.php', {
        user:user,
        username: $rootScope.globals.currentUser.username,
        officer: $rootScope.globals.currentUser.officer
      })
      .success(function(response) {
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

  service.GetUser = function() {
    return $http.post('./Scripts/getUser.php', {ID : $rootScope.globals.currentUser.userID});
  };

  service.GetRoster = function() {
    return $http.post('./Scripts/getRoster.php');
  };

  service.GetChampions = function() {
    return $http.post('./Scripts/getChampion.php');
  };

  service.GetRoles = function() {
    return $http.post('./Scripts/getRole.php');
  };

  service.GetElos = function() {
    return $http.post('./Scripts/getElo.php');
  };

  service.GetBadges = function() {
    return $http.post('./Scripts/getBadge.php');
  };

  return service;
}]);
