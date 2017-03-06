angular.module('mainController', ['authServices'])

.controller('main-controller', function(Auth, $timeout, $location, $rootScope, $window){
  var app = this;

  $rootScope.$on('$routeChangeStart', function(){
    if(Auth.isLoggedIn()){
      //console.log('Success: User is logged in');
      Auth.getUser().then(function(data){
        app.user = data.data;
      });
    } else {
      //console.log('Failure: User has to log in');
      app.username = '';
    }
    if($location.hash() == '_=_') $location.hash(null);
  });

  this.facebook = function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
  }

  this.twitter = function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
  }

  this.google = function(){
    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
  }

  this.doLogin = function(loginData){
    app.loading = true;
    app.errorMsg = false;
    app.successMsg = false;

    Auth.login(app.loginData).then(function(data){
      app.loading = false;
      if(data.data.success){
        app.successMsg = data.data.message;

        $timeout(function(){
          $location.path('/');

          app.successMsg = false;
        }, 2000);
      } else {
        app.errorMsg = data.data.message;
      }
    });
  };

  this.logout = function(){
    Auth.logout();
    $location.path('/logout');
    $timeout(function () {
      $location.path('/');
    }, 2000);
  }
});
