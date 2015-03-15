angular.module('ionic-starter-app.controllers', ['ionic', 'ngSanitize'])

.controller('HomeCtrl', function ($scope, $state, $http, vivoApiHost, $cordovaFacebook, $ionicViewService) {
 if (localStorage.getItem('loginType') == 'facebook') {
    $ionicViewService.nextViewOptions({
      disableAnimate: true
    });

    $state.go('movies');
  }

  $scope.facebookLogin = function () {
    var facebookLoginSuccess = function (response) {
      localStorage.setItem('loginType', 'facebook');
      $state.go('movies');

      // var accessToken = response.authResponse.accessToken;

      // $http.get('https://graph.facebook.com/me?access_token=' + accessToken)
      //      .success(profileInfoSuccess);

      // var apiSuccess = function (data) {
      //   console.log('facebook api data', data);
      //   $state.go('movies');
      // }

      // var apiFailure = function (data) {
      //   console.log('failure facebook data', data);
      //   $state.go('movies');
      // }

      // $cordovaFacebook.api('/me', ['public_profile'], apiSuccess, apiFailure);
    }

    var facebookLoginFailure = function () {
      alert('There was something wrong with the facebook login. Please, try again.');
    }

    $cordovaFacebook.login(['public_profile', 'email'])
      .then(facebookLoginSuccess, facebookLoginFailure);

    return false;
  }
})

.controller('MoviesCtrl', function($scope, MovieFactory) {
  $scope.movies = MovieFactory.movies();
})

.controller('MovieCtrl', function($scope, $stateParams, MovieFactory) {
  $scope.movie = MovieFactory.get($stateParams.id);
})

.controller('SidebarCtrl', function($scope, $state, $cordovaFacebook, $ionicSideMenuDelegate, $ionicPlatform, $ionicHistory) {

  $scope.shouldLeftSideMenuBeEnabled = function () {
    return $ionicHistory.currentView() === null;
  }

  $scope.logout = function () {
    if(localStorage.getItem('loginType') == 'facebook') {
      $ionicPlatform.ready(function () {
        var logoutSuccess = function () {
          $ionicSideMenuDelegate.toggleLeft();
          localStorage.setItem('loginType', '');
          $state.go('home');
        }

        var logoutError = function () {
          alert('There was something wrong with the facebook logout. Please, try again.');
        }

        $cordovaFacebook.logout().then(logoutSuccess, logoutError);
      });
    } else {
      $ionicSideMenuDelegate.toggleLeft();

      localStorage.setItem('loginType', '');
      $state.go('home');

      $ionicSideMenuDelegate.toggleLeft();
    }
  }
})
