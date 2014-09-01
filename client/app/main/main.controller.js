'use strict';

angular.module('socialSearchApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.search = function() {
      var q = $scope.query.replace(' ', '+');

      function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
           array[i] = array[j];
          array[j] = temp;
        }
        return array;
      }

      if (q) {
      var search = '/api/search?q=' + q;
      
      $http.get(search).success(function(data) {
        var res = [];

        for (var key in data) {
          data[key].forEach(function(peice) {
            peice.loc = key;
            res.push(peice);
          });
        }

        res = shuffle(res);

        $scope.response = res;
      });
      }
    };
  });