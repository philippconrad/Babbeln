angular.module('babbelnWeb',
  [
    'babbelnRoutes',
    'userController',
    'userServices',
    'ngAnimate',
    'mainController',
    'authServices',
    'emailController',
    'profileController',
  ])

.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptors');
})
