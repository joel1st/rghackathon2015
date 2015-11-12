'use strict';

// declare modules
angular.module('Admin',[]);
angular.module('Authentication', []);
angular.module('Account', []);
angular.module('Home', []);
angular.module('Register', []);
angular.module('Compress', []).filter('compress', function() {
  return function(text) {
    return String(text).replace(/ /g,'');
  };
});
angular.module('CompressUnderline', []).filter('compressU', function() {
  return function(text) {
    return String(text).replace(/ /g, '_');
  };
});

angular.module('GVLegendsApp', [
  'Admin',
  'Authentication',
  'Account',
  'Home',
  'Register',
  'Compress',
  'CompressUnderline',
  'ngRoute',
  'ngCookies'
])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider
  .when('/', {
    controller: 'HomeController',
    templateUrl: 'Modules/home/views/home.html'
  })

  .when('/admin', {
    templateUrl: 'Modules/admin/views/admin.html',
    controller: 'AdminController',
    resolve: {
      roster: function(AdminService) {
        return AdminService.GetRoster();
      },
      champion: function(AdminService) {
        return AdminService.GetChampions();
      },
      role: function(AdminService) {
        return AdminService.GetRoles();
      },
      elo: function(AdminService) {
        return AdminService.GetElos();
      },
      badge: function(AdminService) {
        return AdminService.GetBadges();
      }
    }
  })

  .when('/account', {
    templateUrl: 'Modules/account/views/account.html',
    controller: 'AccountController',
    resolve: {
      user: function(AdminService) {
        return AdminService.GetUser();
      },
      champion: function(AdminService) {
        return AdminService.GetChampions();
      },
      role: function(AdminService) {
        return AdminService.GetRoles();
      },
      elo: function(AdminService) {
        return AdminService.GetElos();
      },
      badge: function(AdminService) {
        return AdminService.GetBadges();
      }
    }
  })

  .when('/home', {
    templateUrl: 'Modules/home/views/home.html',
    controller: 'HomeController'
  })

  .when('/register', {
    templateUrl: 'Modules/register/views/register.html',
    controller: 'RegisterController'
  })

  .when('/login', {
    controller: 'LoginController',
    templateUrl: 'Modules/authentication/views/login.html',
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

  $rootScope.$on('$locationChangeStart', function(event, next, current) {
    // redirect to login page if not logged in
    if ($location.path() == '/home' || $location.path() == '/' || next == 'https://gvlegends.com/gvlegends/' || next == 'http://gvlegends.com/gvlegends/' || next == 'https://gvlegends.com/gvlegends' || next == 'http://gvlegends.com/gvlegends') {
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
}
]);
