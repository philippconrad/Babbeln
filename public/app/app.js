angular.module('babbelnWeb',
  [
    'babbelnRoutes',
    'userController',
    'userServices',
    'ngAnimate',
    'mainController',
    'authServices',
  ])

.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptors');
})
