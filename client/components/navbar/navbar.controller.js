'use strict';

angular.module('socialSearchApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [
      { 
        'title': 'Home',
        'link': '/'
      },
      { 
        'title': 'Search',
        'link': '/search'
      }
    ];

    $scope.isCollapsed = true;

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });