angular.module('userController', ['userServices'])

.controller('ctrl-registration', function($http, $location, $timeout, User){

  var app = this;

  this.regUser = function(regData, valid){
    app.errorMsg = false;
    app.loading = true;
    app.disabled = true;

    if(valid){
      User.create(app.regData).then(function(data){
        app.loading = false;
        if(data.data.success) {
          app.successMsg = data.data.message;

          $timeout(function(){
            $location.path('/');
          }, 2000);

        } else {
          app.loading = false;
          app.disabled = false;
          app.errorMsg = data.data.message;
        }
      })
    } else {
      app.loading = false;
      app.disabled = false;
      app.errorMsg = 'Bitte alle Felder ordnungsgemäß ausfüllen.';
    }
  };

  this.checkUsername = function(regData){

    app.checkingUsername = true;
    app.usernameMsg = false;
    app.usernameInvalid = false;

    User.checkUsername(app.regData).then(function(data){
      if(data.data.success){
        app.checkingUsername = false;
        app.usernameMsg = data.data.message;
      } else {
        app.checkingUsername = false;
        app.usernameInvalid = true;
        app.usernameMsg = data.data.message;
      }
    });
  };

  this.checkEmail = function(regData){

    app.checkingEmail = true;
    app.emailMsg = false;
    app.emailInvalid = false;

    User.checkEmail(app.regData).then(function(data){
      if(data.data.success){
        app.checkingEmail = false;
        app.emailMsg = data.data.message;
      } else {
        app.checkingEmail = false;
        app.emailInvalid = true;
        app.emailMsg = data.data.message;
      }
    });
  }

})

.directive('match', function(){
  return {
    restrict: 'A',
    controller: function($scope){
      $scope.confirmed = false;

      $scope.doConfirm = function(values){
        values.forEach(function(ele){
          if($scope.confirm == ele){
            $scope.confirmed = true;
          } else {
            $scope.confirmed = false;
          }
        });
      }
    },
    link: function(scope, element, attrs){
      attrs.$observe('match', function(){
        scope.matches = JSON.parse(attrs.match);
        scope.doConfirm(scope.matches);
      });

      scope.$watch('confirm', function(){
        scope.matches = JSON.parse(attrs.match);
        scope.doConfirm(scope.matches);
      })
    }
  }
})

.controller('ctrl-facebook', function($routeParams, Auth, $location, $window){

  var app = this;
  app.errorMsg = false;
  app.expired = false;
  app.disabled = false;

  if($window.location.pathname == '/facebookerror'){
    app.errorMsg = 'Kein verknüpfter Account mit Facebook gefunden';
  } else if($window.location.pathname == '/facebook/inactive/error'){
    app.errorMsg = 'Account ist noch nicht aktiviert.';
    app.expired = true;
  } else {
    Auth.facebook($routeParams.token);
    $location.path('/');
  }
})

.controller('ctrl-twitter', function($routeParams, Auth, $location, $window){

  var app = this;
  app.errorMsg = false;
  app.expired = false;
  app.disabled = false;

  if($window.location.pathname == '/twittererror'){
    app.errorMsg = 'Kein verknüpfter Account mit Twitter gefunden.';
  } else if($window.location.pathname == '/twitter/inactive/error'){
    app.errorMsg = 'Account ist noch nicht aktiviert.';
    app.expired = true;
  } else {
    Auth.twitter($routeParams.token);
    $location.path('/');
  }
})

.controller('ctrl-google', function($routeParams, Auth, $location, $window){

  var app = this;
  app.errorMsg = false;
  app.expired = false;
  app.disabled = false;

  if($window.location.pathname == '/googleerror'){
    app.errorMsg = 'Kein verknüpfter Account mit Google gefunden.';
  } else if($window.location.pathname == '/google/inactive/error'){
    app.errorMsg = 'Account ist noch nicht aktiviert.';
    app.expired = true;
  } else {
    Auth.google($routeParams.token);
    $location.path('/');
  }
});
