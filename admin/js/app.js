'use strict';

angular.module('mps', [
  'ngRoute',
  'angularOauth',
  'googleOauth',
  'mps.global',
  'mps.home',
  'mps.sites',
  'mps.site'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/home/index.html',
    controller: 'home',
    resolve: {
      auth: function(verifyUser) {
        return verifyUser.homepageRedirect();
      }
    }
  });
  $routeProvider.when('/sites', {
    templateUrl: 'views/sites/index.html',
    controller: 'sites',
    resolve: {
      auth: function(verifyUser) {
        return verifyUser.buildUserData();
      }
    }
  });
  $routeProvider.when('/sites/:site', {
    templateUrl: 'views/sites/site.html',
    controller: 'site',
    resolve: {
      auth: function(verifyUser, $route) {
        return verifyUser.buildUserData($route.current.params.site);
      }
    }
  });
  $routeProvider.when('/sites/:site/pages', {
    templateUrl: 'views/sites/pages/index.html',
    controller: 'site',
    resolve: {
      auth: function(verifyUser, $route) {
        console.log($route);
        return verifyUser.buildUserData($route.current.params.site);
      }
    }
  });
  $routeProvider.when('/sites/:site/pages/modify/:token', {
    templateUrl: 'views/sites/pages/modify.html',
    controller: 'site',
    resolve: {
      auth: function(verifyUser, $route) {
        return verifyUser.buildUserData($route.current.params.site);
      }
    }
  });
  $routeProvider.when('/sites/:site/sections', {
    templateUrl: 'views/sites/sections/index.html',
    controller: 'site',
    resolve: {
      auth: function(verifyUser, $route) {
        return verifyUser.buildUserData($route.current.params.site);
      }
    }
  });
  $routeProvider.when('/sites/:site/sections', {
    templateUrl: 'views/sites/sections/index.html',
    controller: 'site',
    resolve: {
      auth: function(verifyUser, $route) {
        return verifyUser.buildUserData($route.current.params.site);
      }
    }
  });
  $routeProvider.when('/sites/:site/content-types', {
    templateUrl: 'views/sites/content-types/index.html',
    controller: 'site',
    resolve: {
      auth: function(verifyUser, $route) {
        return verifyUser.buildUserData($route.current.params.site);
      }
    }
  });
  $routeProvider.when('/sites/:site/packages', {
    templateUrl: 'views/sites/packages/index.html',
    controller: 'site',
    resolve: {
      auth: function(verifyUser, $route) {
        return verifyUser.buildUserData($route.current.params.site);
      }
    }
  });
  $routeProvider.when('/sites/:site/globals', {
    templateUrl: 'views/sites/globals/index.html',
    controller: 'site',
    resolve: {
      auth: function(verifyUser, $route) {
        return verifyUser.buildUserData($route.current.params.site);
      }
    }
  });
  $routeProvider.when('/sites/:site/scheduling', {
    templateUrl: 'views/sites/scheduling/index.html',
    controller: 'site',
    resolve: {
      auth: function(verifyUser, $route) {
        return verifyUser.buildUserData($route.current.params.site);
      }
    }
  });
  $routeProvider.when('/sites/:site/logs', {
    templateUrl: 'views/sites/logs/index.html',
    controller: 'site',
    resolve: {
      auth: function(verifyUser, $route) {
        return verifyUser.buildUserData($route.current.params.site);
      }
    }
  });
  $routeProvider.otherwise({redirectTo: '/'});
}])
.factory('getUserEmail', ['$rootScope', '$window', '$q', '$location', '$timeout', '$http', 'Token', function($rootScope, $window, $q, $location, $timeout, $http, Token) {
  return {

    // Get user email address based on token.
    getEmail: function() {

      var deferred = $q.defer();

      var token = Token.get();

     $http({method: 'GET', async: false, url: 'https://www.googleapis.com/oauth2/v1/tokeninfo', params: {access_token: token }}).
       success(function(data) {
         $rootScope.username = data.email;
         deferred.resolve(data);
         return data;
       }).error(function(data) {
         deferred.reject(data);
       });

      return deferred.promise;

    }

  }
}])
.factory('getUserSites', ['$rootScope', '$window', '$q', '$location', '$timeout', '$http', 'Token', function($rootScope, $window, $q, $location, $timeout, $http, Token) {
  return {

    // Get user site access.
    getSites: function() {

      var deferred = $q.defer();

      console.log('site list is undefined.');
      $http({method: 'GET', async: false, url: '/api/index.php/login/' + $rootScope.username}).
        success(function(data) {
          $rootScope.sites = data.sites;
          deferred.resolve(data);
        }).error(function(data) {
          deferred.reject(data);
        });

      return deferred.promise;

    }

  }
}])
.factory('verifyUser', ['$rootScope', '$window', '$q', '$location', '$timeout', '$http', 'Token', 'getUserEmail', 'getUserSites', function($rootScope, $window, $q, $location, $timeout, $http, Token, getUserEmail, getUserSites) {
  return {

    siteError: function() {
      localStorage.removeItem('accessToken');
      $location.path('/');
    },

    // Redirect user to /sites if logged in.
    homepageRedirect: function() {
      var deferred = $q.defer();
      var token = Token.get();

      if(!token) {
        deferred.resolve(true);
      } else {
        deferred.reject(true);
        $location.path('/sites');
      }

      return deferred.promise;

    },

    // Verify user token exists and they have access to the section.
    buildUserData: function(site) {

      console.log('site',site,'/site');

      var deferred = $q.defer();

      var token = Token.get();

      var _this = this;

      if(!token) {
        deferred.reject('no token');
        localStorage.removeItem('accessToken');
        $location.path('/');
      } else {

        if($rootScope.sites) {
          console.log('site list present, check access.');
          if(site) {
            var data = $rootScope.sites;
            console.log(data, site);
            for(var i in data) {
              console.log(data[i].sitename);
              if(data[i].sitename === site) {
                console.log('user has access, render view.');
                deferred.resolve(true);
                return false;
              }
            }
            console.log('No site access, logout.');
            deferred.reject('No access to site.');
            _this.siteError();
          } else {
            console.log('No access needed, landing page.');
            deferred.resolve(true);
          }
        } else {
          console.log('no site list, get user email from google and query db with user.');
          getUserEmail.getEmail().then(function(data) {
            return getUserSites.getSites();
          }).then(function(data) {
            if(site) {
              console.log('sub page');
              for(var i in data.sites) {
                console.log(data.site[i]);
                if(data.sites[i].sitename === site) {
                  console.log('user has access, render view.');
                  deferred.resolve(true);
                  return false;
                }
              }
              console.log('No site access, logout.');
              deferred.reject('No access to site.');
              _this.siteError();
            } else {
              deferred.resolve(true);
            }
          }).catch(function(data) {
            deferred.reject(true);
            _this.siteError();
          });
        }
      }

      return deferred.promise;

    }

  }
}]);