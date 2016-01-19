'use strict';

var app = angular
  .module('SeatHackApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'firebase',
    'toaster',
    'angularMoment'
  ])
  .constant('FURL', 'https://seathack.firebaseio.com/')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AuthController'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthController'
      })
      .when('/browse', {
        templateUrl: 'views/browse.html',
        controller: 'BrowseController'
      })
      .when('/browse/:ideaId', {
        templateUrl: 'views/browse.html',
        controller: 'BrowseController'
      })
      .when('/home', {
        templateUrl: 'views/home.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
