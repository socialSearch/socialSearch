'use strict';

angular.module('socialSearchApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.sites = ['twitter', 'reddit', 'instagram'];

    $scope.updateFilter = function(site) {
      var i = $.inArray(site, $scope.sites);
      var $button = $('#' + site + '-button');

      if (i > -1) {
        $scope.sites.splice(i, 1);
        $button.removeClass('active');
      } else {
        $scope.sites.push(site);
        $button.addClass('active');
      }
    };

    $scope.siteFilter = function (site) {
      if ($scope.sites.length > 0) {
        if ($.inArray(site.loc, $scope.sites) < 0) {
          return;
        }
      }

      return site;
    };

    $scope.search = function() {
      $('#loading-text').slideToggle();
      $('.cont-media').hide();
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
          data[key].forEach(function(post) {
            post.loc = key;
            res.push(post);
          });
        }
        setTimeout(function () {
          $('#loading-text').slideToggle();
          $('.cont-media').show();
        }, 2500);
        res = shuffle(res);
        $scope.response = res;
      });
      }
    };
  });