angular.module('userController', ['userServices'])

.controller('ctrl-registration', function($http, $location, $timeout, User){

  var app = this;

  this.regUser = function(regData, valid){
    app.errorMsg = false;
    app.loading = true;

    if(valid){
      User.create(app.regData).then(function(data){
        app.loading = false;
        if(data.data.success) {
          app.successMsg = data.data.message;

          $timeout(function(){
            $location.path('/');
          }, 2000);

        } else {
          app.errorMsg = data.data.message;
        }
      })
    } else {
      app.loading = false;
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

.controller('ctrl-facebook', function($routeParams, Auth, $location, $window){

  var app = this;

  if($window.location.pathname == '/facebookerror'){
    app.errorMsg = 'No Account connected with facebook found';
  } else {
    Auth.facebook($routeParams.token);
    $location.path('/');
  }
})

.controller('ctrl-twitter', function($routeParams, Auth, $location, $window){

  var app = this;

  if($window.location.pathname == '/twittererror'){
    app.errorMsg = 'No Account connected with twitter found';
  } else {
    Auth.twitter($routeParams.token);
    $location.path('/');
  }
})

.controller('ctrl-google', function($routeParams, Auth, $location, $window){

  var app = this;

  if($window.location.pathname == '/googleerror'){
    app.errorMsg = 'No Account connected with google found';
  } else {
    Auth.google($routeParams.token);
    $location.path('/');
  }
});
