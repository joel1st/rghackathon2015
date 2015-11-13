'use strict';

// declare modules
angular.module('Admin',[]);
angular.module('Authentication', []);
angular.module('Account', []);
angular.module('Create', []);
angular.module('Find', []);
angular.module('Home', []);
angular.module('Register', []);

angular.module('RGHackathonApp2015', [
  'Admin',
  'Authentication',
  'Account',
  'Create',
  'Find',
  'Home',
  'Register',
  'ngRoute',
  'ngCookies'
])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider
  .when('/', {
    controller: 'HomeController',
    templateUrl: 'modules/home/views/home.html'
  })

  .when('/admin', {
    templateUrl: 'modules/admin/views/admin.html',
    controller: 'AdminController'
  })

  .when('/account', {
      templateUrl: 'modules/account/views/account.html',
      controller: 'AccountController'
  })

  .when('/create', {
      templateUrl: 'modules/create/views/create.html',
      controller: 'CreateController'
  })

  .when('/find', {
      templateUrl: 'modules/find/views/find.html',
      controller: 'FindController'
  })

  .when('/home', {
    templateUrl: 'modules/home/views/home.html',
    controller: 'HomeController'
  })

  .when('/register', {
    templateUrl: 'modules/register/views/register.html',
    controller: 'RegisterController'
  })

  .when('/login', {
    controller: 'LoginController',
    templateUrl: 'modules/authentication/views/login.html',
    hideMenus: true
  })

  .otherwise({
    redirectTo: '/home'
  });
}])

.run(['$rootScope', '$location', '$cookieStore', '$http',
function($rootScope, $location, $cookieStore, $http) {
  // keep user logged in after page refresh
  $rootScope.globals = $cookieStore.get('globals') || {};
  if ($rootScope.globals.currentUser) {
    $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
  }

/*  
  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    if ($location.path() == '/home' || $location.path() == '/') {
      $location.path('/home');
    } else if ($location.path() == '/register') {
      if ($rootScope.globals.currentUser) {
        $location.path('/account');
      } else {
        $location.path('/register');
      }
    } else if ($location.path() == '/admin') {
      if (!$rootScope.globals.currentUser || $rootScope.globals.currentUser.officer != 1 ) {
        $location.path('/home');
      } else {
        $location.path('/admin');
      }
    } else if ($location.path() !== '/login'  && !$rootScope.globals.currentUser) {
      $location.path('/login');
    }
  });
*/
}
]);
