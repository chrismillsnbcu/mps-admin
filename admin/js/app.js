'use strict';

angular.module('mps', [
  'ngRoute',
  'angularOauth',
  'googleOauth',
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
    controller: 'view',
    resolve: {
      auth: function(verifyAuth) {
        verifyAuth.verifyUser();
      }
    }
  }).otherwise({redirectTo: '/'});
  $routeProvider.otherwise({redirectTo: '/'});
}])
.factory('verifyAuth', ['$rootScope', '$window', '$q', '$location', 'Token', function($rootScope, $window, $q, $location, Token) {
  // Verify token exists before showing view, secondary verification in view controller.
  return {
    userError: function(deferred) {
      console.log("Failed to verify token.");
      deferred.reject();
      $location.path('/');
      Token.clear();
      return false;
    },
    verifyUser: function () {
      // Verify token exists.
      var token = Token.get();
      var deferred = $q.defer();
      if(token) {
        var _this = this;
        // Verify token is authentic to user and has not been modified to gain access.
        Token.verifyAsync(token).
          then(function(data) {
            console.log('User access verified.');
            console.log(data);
            deferred.resolve(true);
          }, function() {
            _this.userError(deferred);
          });
      } else {
        this.userError(deferred);
      }
      return false;
    }
  }
}]);