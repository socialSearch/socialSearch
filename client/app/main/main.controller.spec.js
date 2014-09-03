'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('socialSearchApp'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    //$httpBackend = _$httpBackend_;
    //$httpBackend.expectGET('/api/things')
    //   .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('Should have nothing filtered by default', function () {
    expect(scope.filtered).toEqual(['twitter', 'reddit', 'instagram']);
  });

  it('Should remove a filtered site', function () {
    scope.filter('reddit');
    expect(scope.filtered).toEqual(['twitter', 'instagram']);
  });

  it('Shuffle should return a different array', function () {
    var arr = [1, 2, 3, 4, 5];
    var ret = scope.shuffle(arr);
    expect(ret).not.toEqual([1,2,3,4,5]);
  });
});
