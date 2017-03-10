angular.module('profileController', ['ngFileUpload'])

  .controller('ctrl-profile', function(Upload){

    var app = this;

    this.updatePhoto = function(picFile){
      picFile.upload = Upload.upload({
      url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
      data: {username: $scope.username, file: file},
    });
    }
    console.log(app);
  })
