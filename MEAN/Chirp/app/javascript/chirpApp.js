var app = angular.module('chirpApp', []);

app.controller('mainController', function ($scope) {
    $scope.posts = [];
    $scope.newPost = {
                          createdBy: '',
                          text: '',
                          createdAt: ''
                          };

    $scope.post = function() {
        $scope.newPost.createdAt = Date.now();
        $scope.posts.push($scope.newPost);
        $scope.newPost = {
                          createdBy: '',
                          text: '',
                          createdAt: ''
                          };
    };
});

app.controller('authController', function($scope) {
  $scope.user = {username: '', password: ''};
  $scope.errorMessage = '';

  $scope.login = function() {
    $scope.errorMessage = 'login request for ' + $scope.user.username;
  };

  $scope.register = function() {
    $scope.errorMessage = 'Registration request for ' + $scope.user.username;
  };
});
