'use strict';

angular.module('mps.global', ['ngRoute', 'googleOauth', 'angularOauth'])
.config(function(TokenProvider) {

  TokenProvider.extendConfig({
    clientId: '570595622215-3n9ehin1bb1d9vi0arut25mteisgcuct.apps.googleusercontent.com',
    redirectUri: 'http://localhost:4000/admin/oauth2callback.html',
    scopes: ["https://www.googleapis.com/auth/userinfo.email"]
  });

})
  .controller('global', ['$rootScope', '$scope', '$window', '$location', 'Token', function($rootScope, $scope, $window, $location, Token) {

    $scope.accessToken = Token.get();

    // Authentication.
    $scope.accessTokenVerify = function() {
      console.log('token: ' + Token.get());
      return Token.get();
    };

    console.log('Token: ' + $scope.accessToken);

    $scope.authenticate = function() {

      var extraParams = $scope.askApproval ? {approval_prompt: 'force'} : {};

      Token.getTokenByPopup(extraParams)
        .then(function(params) {
          // Success getting token from popup.

          // Verify the token before setting it, to avoid the confused deputy problem.
          Token.verifyAsync(params.access_token).
            then(function(data) {
              $rootScope.$apply(function() {
                console.log(data);
                $scope.accessToken = params.access_token;
                $scope.expiresIn = params.expires_in;
                $scope.email = data.email;
                $scope.userId = data.user_id;
                Token.set(params.access_token);
                $location.path('/sites');
                // TODO query database for user permissions, store in $scope.
              });
            }, function() {
              alert("Failed to verify token.")
            });

        }, function() {
          // Failure getting token from popup.
          alert("Failed to get token from popup.");
        });
    };

    $scope.logout = function() {
      console.log('logout');
      Token.clear();
      $location.path('/');
    };

  }]);