'use strict';

angular.module('Register')

.controller('RegisterController', ['$scope', '$location','$timeout','RegisterService', function($scope, $location, $timeout,RegisterService) {
  $scope.currentUser = {
    name: "",
    password:"",
    summoner:"",
    summonerID:"",
    email:""
  };

  $scope.register = function () {
    $scope.error = '';
    $scope.dataLoading = true;
    RegisterService.CheckSummoner($scope.currentUser.summoner, function(response) {

      if(response.success) {
        console.log(response);
        $scope.currentUser.summonerID = response.summonerID;
        $scope.currentUser.summoner = response.summonerName;
        RegisterService.AddUser($scope.currentUser)
        .success(function success(data) {

          if (data.success) {
            $scope.good = 'Success! Directing you to login.';
            $timeout(function() {
              $location.path('/login');
            }, 2000);
          } else {
            $scope.error = 'This user already exists.';
            $scope.dataLoading = false;
          }

        });
      } else {
        $scope.error = 'Problem either finding Summoner or contacting server.';
        $scope.dataLoading = false;
      }
    });
  };

}]);
