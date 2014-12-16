'use strict';

angular.module('mps.global', ['ngRoute', 'googleOauth', 'angularOauth'])
.config(function(TokenProvider) {

  TokenProvider.extendConfig({
    clientId: '570595622215-3n9ehin1bb1d9vi0arut25mteisgcuct.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4000/admin/oauth2callback.html',
    scopes: ["https://www.googleapis.com/auth/userinfo.email"]
  });

})
  .controller('global', ['$rootScope', '$scope', '$window', '$location', '$http', 'Token', function($rootScope, $scope, $window, $location, $http, Token) {

    // Authentication.
    $scope.accessTokenVerify = function() {
      return Token.get();
    };

    // Login with google oauth.
    $scope.authenticate = function() {

      var extraParams = $scope.askApproval ? {approval_prompt: 'force'} : {};

      Token.getTokenByPopup(extraParams)
        .then(function(params) {
          Token.verifyAsync(params.access_token).
            then(function(data) {
              $rootScope.$apply(function() {
                Token.set(params.access_token);
                $rootScope.username = data.email;
                $location.path('/sites');
              });
            }, function() {
              $scope.logout(null, 'Token verification failed.');
            });

        }, function() {
          // Failure getting token from popup.
          $scope.logout(null, 'Token verification failed.');
        });
    };

    $scope.logout = function(event, error) {
      if(event) { event.preventDefault(); }
      Token.clear();
      $location.path('/');
      if(error) {
        switch(error) {
          case 'no_access':
            alert('You have no site access, please contact your administrator.');
            break;
          case 'server':
            alert('There was a problem with your request, please try again later.');
            break;
        }
      }
    };

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
      formatTitle: function(path) {

        var title = '';

        if(!path) {
          var path = this.getSiteName();
        }
        path = path.split('-');

        for(var i in path) {
          var _this = path[i].toLowerCase();
          _this = _this.charAt(0).toUpperCase() + _this.substring(1);
          title += _this + ' ';
        }

        // Format brand names manually.
        title = title.replace('nbc','NBC');
        title = title.replace('Nbc','NBC');
        title = title.replace('Nhl','NHL');
        title = title.replace('Eonline','E! Online');
        title = title.replace('Usa','USA');

        return title;
      }
    }
  }]);