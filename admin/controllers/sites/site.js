'use strict';

angular.module('mps.site', ['ngRoute'])
.controller('site', ['$scope', '$location', 'pageTitle', function($scope, $location, pageTitle) {

    $scope.title = pageTitle.getTitle();

    $scope.siteName = pageTitle.getSiteName();

}])
.service('pageTitle', ['$rootScope', '$window', '$q', '$location', 'Token', function($rootScope, $window, $q, $location, Token) {
  return {
    getSiteName: function() {
      var siteName = $location.$$path;
      siteName = siteName.split('/');
      console.log(siteName);
      siteName = siteName[2].replace('/sites/','');
      return siteName;
    },
    getTitle: function() {

      var title = '';
      var path = this.getSiteName();
      path = path.split('-');

      for(var i in path) {
        var _this = path[i].toLowerCase();
        _this = _this.charAt(0).toUpperCase() + _this.substring(1);
        title += _this + ' ';
      }

      // Format names.
      title = title.replace('nbc','NBC');
      title = title.replace('Nbc','NBC');
      title = title.replace('Nhl','NHL');
      title = title.replace('Eonline','E! Online');
      title = title.replace('Usa','USA');

      return title;
    }
  }
}]);