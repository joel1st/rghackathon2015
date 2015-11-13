'use strict';

angular.module('Staff')

.controller('StaffController', ['$scope', function ($scope) {
  $scope.title = "Staff";

  $scope.colors = ['#FF0000','#0000FF','#00FF00'];
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B', 'Series C'];
  $scope.data = [
    [45, 50, 20, 31, 26, 15, 40],
    [28, 48, 40, 19, 46, 27, 50],
    [35, 44, 50, 50, 20, 50, 15]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

  $scope.officers = [];
  $scope.honorable = [];

  $scope.officers.push({fullName: "Jerry Collom", summoner: "Sergeant Shizno", position: "President"});
  $scope.officers.push({fullName: "Christian Ross", summoner: "IntricateDeath", position: "Competitive Team Organizer / Web Admin"});
  $scope.officers.push({fullName: "Eric Pastula", summoner: "Kazumanosora", position: "Vice President"});
  $scope.officers.push({fullName: "Onnika Bell", summoner: "Kathmia", position: "Secretary"});

  $scope.honorable.push({fullName: "Austin Anderson", summoner: "Lord Imrhial", contribution: "Website Creator"});
  $scope.honorable.push({fullName: "Jacob Collins", summoner: "jCollins14", contribution: "Graphic Design / General help"});

}]);
