'use strict';

angular.module('Home')

.controller('HomeController', ['$scope', '$rootScope', '$location', '$cookieStore', function($scope, $rootScope, $location, $cookieStore) {
  $scope.title = "Home";
  $rootScope.globals = $cookieStore.get('globals') || {};

  $scope.logout = function() {
    $location.path('/login');
  };

}]);
