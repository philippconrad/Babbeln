angular.module('babbelnWeb',
  [
    'babbelnRoutes',
    'userController',
    'userServices',
    'ngAnimate',
    'mainController',
    'authServices',
    'emailController',
  ])

.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptors');
})
