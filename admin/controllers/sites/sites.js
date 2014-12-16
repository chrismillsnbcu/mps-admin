'use strict';

angular.module('mps.sites', ['ngRoute'])
.controller('sites', ['$rootScope', '$scope', '$q', 'pageTitle', function($rootScope, $scope, $q, pageTitle) {

    if(!$rootScope.sites) {
      alert('Error! no sites stored.');
      console.log('No user sites are stored from an unknown error, please login again.');
      $scope.logout();
    }

    // Build site list based on user permissions.
    $scope.sites = $rootScope.sites;

    $scope.formatName = function(name) {
      return pageTitle.formatTitle(name);
    };

    console.log($scope.sites);

}]);