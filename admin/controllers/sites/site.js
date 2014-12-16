'use strict';

angular.module('mps.site', ['ngRoute'])
.controller('site', ['$scope', '$rootScope', '$location', '$http', 'pageTitle', function($scope, $rootScope, $location, $http, pageTitle) {

    // Get site info based off url.
    $scope.title = pageTitle.formatTitle();

    $scope.siteName = pageTitle.getSiteName();

    // Get site id based off site name.
    for(var i=0; i<$rootScope.sites.length; i++) {
      console.log('loop to grab id',$rootScope.sites[i].id, 'loop to grab id');
      if($rootScope.sites[i].sitename === $scope.siteName) {
        console.log('matcher');
        $scope.currentID = $rootScope.sites[i].id;
      }
    }

    // Load site page data onload.
    $http({method: 'GET', async: false, url: '/api/index.php/sites/' + $scope.currentID + '/index/' + $rootScope.username }).
      success(function(data) {
        // Verify username matches $rootScope.
        if(data.user === $rootScope.username) {
          // Populate page data.
          //$scope.buildPage(data.site);
        } else {
          // Invalid user, logout.
          console.log('Invalid user name, end session and redirect to login.');
          $scope.logout(null, 'no_access');
        }
      }).error(function(data) {
        $scope.logout(null, 'server');
      });


    // Populate page data.
    $scope.buildPage = function(site) {
      for(var i=0; i<site.length; i++) {
        console.log(site[i]);
      }
      // Hide loader.

    };

    /*** Update page data functions ***/
    // Updates to page data.
    $scope.updateSomething = function() {
      $http({method: 'POST', async: false, url: '/api/index.php/sites/' + $scope.title + '/index/something/' + $rootScope.username }).
        success(function(data) {

        }).error(function(data) {
          $scope.logout(null, 'server');
        });
    };

}]);