angular.module('mainController', ['authServices'])

.controller('main-controller', function(Auth, $timeout, $location, $rootScope, $window){
  var app = this;

  $rootScope.$on('$routeChangeStart', function(){
    app.loggedIn = false;
    if(Auth.isLoggedIn()){
      Auth.getUser().then(function(data){
        app.user = data.data;
        app.loggedIn = true;
      });
    } else {
      app.username = null;
      app.loggedIn = false;
    }
    if($location.hash() == '_=_') $location.hash(null);
  });

  this.facebook = function(){
    app.disabled = true;
    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
  }

  this.twitter = function(){
    app.disabled = true;
    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/twitter';
  }

  this.google = function(){
    app.disabled = true;
    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
  }

  this.doLogin = function(loginData){
    app.loading = true;
    app.errorMsg = false;
    app.successMsg = false;
    app.expired = false;
    app.disabled = true;

    Auth.login(app.loginData).then(function(data){
      app.loading = false;
      if(data.data.success){
        app.successMsg = data.data.message;

        $timeout(function(){
          $location.path('/');
          app.loginData = '';
          app.successMsg = false;
        }, 2000);
      } else {
        if(data.data.expired){
          app.expired = true;
          app.disabled = true;
          app.errorMsg = data.data.message;
        } else {
          app.errorMsg = data.data.message;
          app.disabled = false;
        }

      }
    });
  };

  this.logout = function(){
    Auth.logout();
    $location.path('/logout');
    $timeout(function () {
      $location.path('/');
    }, 1000);
  }

});
