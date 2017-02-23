angular.module('babbelnRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){

  $routeProvider

  .when('/', {
    templateUrl: 'app/views/pages/home.html'
  })

  .when('/about', {
    templateUrl: 'app/views/pages/about.html'
  })

  .when('/register', {
    templateUrl: 'app/views/pages/users/register.html',
    controller: 'user-registration',
    controllerAs: 'register'
  })

  .otherwise({ redirectTo: '/'});

  $locationProvider.html5Mode(false).hashPrefix('');
});
