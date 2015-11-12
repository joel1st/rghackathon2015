'use strict';

angular.module('Account')

.controller('AccountController', ['$scope','$timeout','AccountService','user','champion','role','elo','badge',
  function($scope, $timeout, AccountService, user, champion, role, elo, badge) {
    $("#success-alert").hide();
    $("#failure-alert").hide();
    $scope.good = "";
    $scope.error = "";


    $scope.userData = user.data;
    $scope.championData = champion.data;
    $scope.roleData = role.data;
    $scope.eloData = elo.data;
    $scope.badgeData = badge.data;


    $scope.editInfo = function() {
      $('#myModal1').modal('hide')
      AccountService.EditInfo(
        $scope.userData.id,
        $scope.userData.name,
        $scope.userData.summoner,
        $scope.userData.email,
        $scope.userData.twitch,
        $scope.userData.summonerdescription,
        function(response) {
        if (response.success) {
          $scope.good = "Changes Updated!";
          success();
        } else {
          $scope.error = 'Changes Failed!';
          failure();
        }
      });
    };

    $scope.editChampRole = function() {
      $('#myModal2').modal('hide')
      AccountService.EditChampRole(
        $scope.userData.id,
        $scope.userData.champion1,
        $scope.userData.champion2,
        $scope.userData.champion3,
        $scope.userData.role1,
        $scope.userData.role2,
        function(response) {
        if (response.success) {
          $scope.good = "Changes Updated!";
          success();
        } else {
          $scope.error = 'Changes Failed!';
          failure();
        }
      });
    };

    $scope.editElo = function() {
      $('#myModal3').modal('hide')
      AccountService.EditElo(
        $scope.userData.id,
        $scope.userData.elo,
        $scope.userData.s1,
        $scope.userData.s2,
        $scope.userData.s3,
        $scope.userData.s4,
        function(response) {
        if (response.success) {
          $scope.good = "Changes Updated!";
          success();
        } else {
          $scope.error = 'Changes Failed!';
          failure();
        }
      });
    };

    function success() {
      allDone();
      $("#success-alert").alert();
      $("#success-alert").fadeTo(1000, 500).slideUp(500, function() {
        $("#success-alert").alert('close');
      });
    }

    function failure() {
      allDone();
      $("#failure-alert").alert();
      $("#failure-alert").fadeTo(1000, 500).slideUp(500, function() {
        $("#failure-alert").alert('close');
      });
    }

    function allDone() {
      $(function() {
        $('body').scrollTop(0);
        $scope.edited = false;
      });
    }

    $scope.disableEdits = function() {
      $scope.edited = true;
    }

  }
]);
