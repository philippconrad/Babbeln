var app = angular.module('babbelnRoutes', ['ngRoute'])

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
    controller: 'ctrl-registration',
    controllerAs: 'register',
    authenticated: false
  })

  .when('/login', {
    templateUrl: 'app/views/pages/users/login.html',
    authenticated: false
  })

  .when('/logout', {
    templateUrl: 'app/views/pages/users/logout.html',
    authenticated: true
  })

  .when('/activate/:token', {
    templateUrl: 'app/views/pages/users/activation/activate.html',
    controller: 'ctrl-email',
    controllerAs: 'email',
    authenticated: false
  })

  .when('/resend', {
    templateUrl: 'app/views/pages/users/activation/resend.html',
    controller: 'ctrl-resend',
    controllerAs: 'resend',
    authenticated: false
  })

  .when('/me', {
    templateUrl: 'app/views/pages/users/me.html',
    controller: 'ctrl-profile',
    controllerAs: 'profile',
    authenticated: true
  })

  .when('/facebook/:token', {
    templateUrl: 'app/views/pages/users/social/social.html',
    controller: 'ctrl-facebook',
    controllerAs: 'facebook',
    authenticated: false
  })

  .when('/facebookerror', {
    templateUrl: 'app/views/pages/users/login.html',
    controller: 'ctrl-facebook',
    controllerAs: 'facebook',
    authenticated: false
  })

  .when('/twitter/:token', {
    templateUrl: 'app/views/pages/users/social/social.html',
    controller: 'ctrl-twitter',
    controllerAs: 'twitter',
    authenticated: false
  })

  .when('/twittererror', {
    templateUrl: 'app/views/pages/users/login.html',
    controller: 'ctrl-twitter',
    controllerAs: 'twitter',
    authenticated: false
  })

  .when('/google/:token', {
    templateUrl: 'app/views/pages/users/social/social.html',
    controller: 'ctrl-google',
    controllerAs: 'google',
    authenticated: false
  })

  .when('/googleerror', {
    templateUrl: 'app/views/pages/users/login.html',
    controller: 'ctrl-google',
    controllerAs: 'google',
    authenticated: false
  })

  .when('/facebook/inactive/error', {
    templateUrl: 'app/views/pages/users/login.html',
    controller: 'ctrl-facebook',
    controllerAs: 'facebook',
    authenticated: false
  })

  .when('/twitter/inactive/error', {
    templateUrl: 'app/views/pages/users/login.html',
    controller: 'ctrl-twitter',
    controllerAs: 'twitter',
    authenticated: false
  })

  .when('/google/inactive/error', {
    templateUrl: 'app/views/pages/users/login.html',
    controller: 'ctrl-google',
    controllerAs: 'google',
    authenticated: false
  })

  .when('/resetusername', {
    templateUrl: 'app/views/pages/users/reset/username.html',
    controller: 'ctrl-username',
    controllerAs: 'username',
    authenticated: false
  })

  .when('/resetpassword', {
    templateUrl: 'app/views/pages/users/reset/username.html',
    controller: 'ctrl-password',
    controllerAs: 'password',
    authenticated: false
  })

  .when('/reset/:token', {
    templateUrl: 'app/views/pages/users/reset/newpassword.html',
    controller: 'ctrl-reset',
    controllerAs: 'reset',
    authenticated: false
  })

  .otherwise({ redirectTo: '/'});

  $locationProvider.html5Mode(true).hashPrefix('');
});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){
  $rootScope.$on('$routeChangeStart', function(event, next, current){
    if(next.$$route.authenticated){
      if(!Auth.isLoggedIn()){
        event.preventDefault();
        $location.path('/');
      }
    } else if(!next.$$route.authenticated){
      if(Auth.isLoggedIn()){
        event.preventDefault();
        $location.path('/me');
      }
    }
  });
}]);
