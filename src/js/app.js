console.log('Current env read from config/*.json files:', '@@currentEnv');

angular.module('ionic-starter-app', ['ionic', 'ionic-starter-app.controllers', 'ionic-starter-app.factories', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $sceDelegateProvider, $cordovaFacebookProvider) {
  if(!window.cordova) {
    var appKey  = '@@fbAppKey';
    var version = '@@fbVersion';

    $cordovaFacebookProvider.browserInit(appKey, version);
  }

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'home.html',
      controller: 'HomeCtrl'
    })

    .state('movies', {
      url: '/movies',
      templateUrl: 'movies.html',
      controller: 'MoviesCtrl'
    })

    .state('movie', {
      url: '/movies/:id',
      templateUrl: 'movie.html',
      controller: 'MovieCtrl'
    })

    $urlRouterProvider.otherwise('/home');

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://www.youtube.com/**'
    ])
})
