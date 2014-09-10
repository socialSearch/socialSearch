/*jshint -W083 */
'use strict';

angular.module('socialSearchApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.sites = {
      'twitter': '.tweet-box',
      'reddit': '.reddit-box',
      'instagram': '.insta-box'};

    $scope.filtered = ['twitter', 'reddit', 'instagram'];

    $scope.filter = function(site) {
      var i = $.inArray(site, $scope.filtered);
      var $button = $('#' + site + '-button');

      if (i > -1) {
        $scope.filtered.splice(i, 1);
        $($scope.sites[site]).hide();
        $button.removeClass('active');
      } else {
        $scope.filtered.push(site);
        $($scope.sites[site]).show();
        $button.addClass('active');
      }
    };

    function loadFilters() {
      $('.tweet-box').hide();
      $('.reddit-box').hide();
      $('.insta-box').hide();
      $scope.filtered.forEach(function (site) {
        $($scope.sites[site]).show();
      });
    }

    $scope.shuffle = function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
         array[i] = array[j];
        array[j] = temp;
      }
      return array;
    };

    $scope.timeAgo = function(unixT) {

      var d = new Date();
      var nowTs = Math.floor(d.getTime()/1000);
      var seconds = nowTs-unixT;
      var time = 0;

      if (seconds >= 12*30*24*60*60) {
        time = Math.floor(seconds/(12*30*24*60*60));
        return time > 1 ? time + ' years ago' : time + ' year ago';
      } else if (seconds >= 30*24*60*60) {
        time = Math.floor(seconds/(30*24*60*60));
        return time > 1 ? time + ' months ago' : time + ' month ago';
      } else if (seconds >= 24*60*60) {
        time = Math.floor(seconds/(24*60*60));
        return time > 1 ? time + ' days ago' : time + ' day ago';
      } else if (seconds >= 60*60) {
        time = Math.floor(seconds/(60*60));
        return time > 1 ? time + ' hours ago' : time + ' hour ago';
      } else if (seconds >= 60) {
        time = Math.floor(seconds/60);
        return time > 1 ? time + ' minutes ago' : time + ' minute ago';
      } else {
        time = Math.floor(seconds);
        return time > 1 ? time + ' seconds ago' : time + ' second ago';
      }
    };

    /*
    // Angular filter function
    $scope.siteFilter = function (site) {
      if ($scope.sites.length > 0) {
        if ($.inArray(site.loc, $scope.sites) < 0) {
          return;
        }
      }

      return site;
    };
    */

    $scope.search = function() {
      $('#loading-text').slideToggle();
      $('.cont-media').hide();
      var q = $scope.query.replace(' ', '+');

      if (q) {
      var search = '/api/search?q=' + q;
      
      $http.get(search).success(function(data) {
        var res = [];

        for (var key in data) {
          data[key].forEach(function(post) {
            post.loc = key;

            if (key === 'reddit') {
              if (post.title.length > 100) {
                post.title = post.title.substr(0,100) + '...';
              }
              post.date = $scope.timeAgo(post.date);
            }
            res.push(post);
          });
        }
        setTimeout(function () {
          loadFilters();
          $('#loading-text').slideToggle();
          $('.cont-media').show();
        }, 2500);
        res = $scope.shuffle(res);
        res = $scope.shuffle(res);
        $scope.response = res;
      });
      }
    };
  });