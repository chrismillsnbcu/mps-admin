'use strict';

angular.module('mps', [
  'ngRoute',
  'mps.global',
  'mps.home',
  'mps.view'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/home/index.html',
    controller: 'home'
  });
  $routeProvider.when('/view', {
    templateUrl: 'views/view/index.html',
    controller: 'view'
  });
  $routeProvider.otherwise({redirectTo: '/'});
}]);