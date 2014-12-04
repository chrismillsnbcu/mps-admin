'use strict';

angular.module('mps', [
  'ngRoute',
  'angularOauth',
  'googleOauth',
  'mps.global',
  'mps.home',
  'mps.sites'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/home/index.html',
    controller: 'home',
    resolve: {
      auth: function(verifyAuth) {
        verifyAuth.verifyUser(true);
      }
    }
  });
  $routeProvider.when('/sites', {
    templateUrl: 'views/sites/index.html',
    controller: 'sites',
    resolve: {
      auth: function(verifyAuth) {
        verifyAuth.verifyUser(false);
      }
    }
  });
  $routeProvider.otherwise({redirectTo: '/'});
}])
.factory('verifyAuth', ['$rootScope', '$window', '$q', '$location', 'Token', function($rootScope, $window, $q, $location, Token) {
  // Verify token exists before showing view, secondary verification in view controller.
  // verifyAuth.verifyUser(true) for homepage, verifyAuth.verifyUser(false);
  return {
    userError: function(deferred) {
      deferred.reject();
      $location.path('/');
      Token.clear();
    },
    verifyUser: function (index) {
      
      var token = Token.get();
      var deferred = $q.defer();
      var _this = this;
      var _location = $location;

      switch(index) {
        // homepage.
        case true:
            // Token present, redirect to /sites page.
            if(token) {
              deferred.reject();
              _location.path('/sites');
            // No token, show homepage.
            } else {
              deferred.resolve(true);
            }
          break;
        // password protected subpage.
        default:
          // Verifiy token, continue page change.  If invalid, clear and redirect to homepage.
          if(token) {
            Token.verifyAsync(token).
              then(function(data) {
                deferred.resolve(true);
              }, function(error) {
                _this.userError(deferred);
              }
            );
          // No token present, redirect to homepage.
          } else {
            _this.userError(deferred);
          }
          break;
      }
    }
  }
}]);