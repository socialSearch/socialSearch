'use strict';

angular.module('socialSearchApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.search = function() {
      var q = $scope.query.replace(' ', '+');

      if (q) {
      var search = '/api/search?q=' + q;
      
      $http.get(search).success(function(data) {
        $scope.response = data;
      });
      }
    };
  });