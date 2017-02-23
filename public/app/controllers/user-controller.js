angular.module('userController', ['userServices'])

.controller('user-registration', function($http, $location, $timeout, User){

  var app = this;

  this.regUser = function(regData){
    app.errorMsg = false;
    app.loading = true;

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
  }

});
