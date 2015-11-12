'use strict';

angular.module('Admin')

.controller('AdminController', ['$scope', '$timeout', '$route','AdminService','roster','champion','role','elo','badge',
function($scope, $timeout, $route, AdminService, roster, champion, role, elo, badge) {
  $("#success-alert").hide();
  $("#failure-alert").hide();
  $scope.good = "";
  $scope.error = "";
  $scope.users = true;
  $scope.passwordUpdate = "";
  $scope.currentUser = {};

  $scope.rosterData = roster.data;
  $scope.championData = champion.data;
  $scope.roleData = role.data;
  $scope.eloData = elo.data;
  $scope.badgeData = badge.data;

  $scope.hideAll = function() {
    $scope.users = false;
    $scope.champs = false;
    $scope.roles = false;
    $scope.elos = false;
    $scope.news = false;
    $scope.events = false;
    $scope.badges = false;
  };

  $scope.officerDropdown =
  [
    {"text":"No","value":"0"},
    {"text":"Yes","value":"1"}
  ];

  $scope.delete = function(user) {
    $scope.currentUser = user;
    $('#myModalDelete').modal('show');
  }

  $scope.edit = function(user) {
    $scope.currentUser = user;
    $('#myModalEdit').modal('show');
  }

  $scope.resetPassword = function() {
    $('#myModalEdit').modal('hide');
    $('#myModalPassword').modal('show');
  }

  $scope.confirmPassword = function() {
    $('#myModalPassword').modal('hide')
    AdminService.PasswordUser($scope.currentUser.id, $scope.passwordUpdate, function(response) {
      console.log($scope.currentUser.id);
      console.log($scope.passwordUpdate);
      if (response.success) {
        $scope.good = "Changes Updated!";
        $route.reload();
        success();
      } else {
        $scope.error = 'Changes Failed!';
        failure();
      }
    });
  }

  $scope.confirmDelete = function() {
    $('#myModalDelete').modal('hide')
    AdminService.DeleteUser($scope.currentUser.id, function(response) {
      if (response.success) {
        $scope.good = "Changes Updated!";
        $route.reload();
        success();
      } else {
        $scope.error = 'Changes Failed!';
        failure();
      }
    });
  }

  $scope.confirmEdit = function() {
    $('#myModalEdit').modal('hide')
    AdminService.EditUser($scope.currentUser, function(response) {
      if (response.success) {
        $scope.good = "Changes Updated!";
        $route.reload();
        success();
      } else {
        $scope.error = 'Changes Failed!';
        failure();
      }
    });
  }

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

}
]);
