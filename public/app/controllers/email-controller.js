angular.module('emailController', ['userServices'])

  .controller('ctrl-email', function($routeParams, User, $timeout, $location){
    app = this;

    User.activeAccount($routeParams.token).then(function(data){
      app.successMsg = false;
      app.errorMsg = false;
      if(data.data.success){
        app.successMsg = data.data.message;
        $timeout(function(){
          $location.path('/login');
        }, 2000);
      } else {
        app.errorMsg = data.data.message;
        $timeout(function(){
          $location.path('/login');
        }, 2000);
      }
    });
  })

  .controller('ctrl-resend', function(User){
    app = this;

    app.checkCredentials = function(loginData){
      app.errorMsg = false;
      app.successMsg = false;
      app.disabled = true;
      User.checkCredentials(app.loginData).then(function(data){
        if(data.data.success){
          User.resendLink(app.loginData).then(function(data){
            if(data.data.success){
              app.successMsg = data.data.message;
            }
          });

        } else {
          app.disabled = false;
          app.errorMsg = data.data.message;
        }
      });
    }
  })
