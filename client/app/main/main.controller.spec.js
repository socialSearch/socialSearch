'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('socialSearchApp'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/search?q=cat')
      .respond({
        instagram: [{
          'date': '1410287870',
          'link': 'http://instagram.com/p/svC4XcH2-U/',
          'loc': 'instagram',
          'picture': 'http://scontent-a.cdninstagram.com/hphotos-xfa1/t51.2885-15/10598645_150616045109011_1702766430_n.jpg',
          'proPic' : 'http://images.ak.instagram.com/profiles/profile_11632010_75sq_1319397848.jpg',
          'user': 'stoddigasumpen'
        }],
        reddit: [{
          'author': 'seamus-cat',
          'date': 1330310600,
          'domain': 'imgur.com',
          'link': 'http://imgur.com/05RTC',
          'loc': 'reddit',
          'num_comments': 197,
          'score': 1207,
          'subreddit': 'cats',
          'title': 'A year ago my cat was hit by a car.... this is him today. Isn\'t this extremely sad? I miss him so much :C This has gotta be over 100 chars long.'
        }],
        twitter: [{
          'date': 'Tue Sep 09 19:11:34 +0000 2014',
          'link': 'https://twitter.com/220558916/statuses/509418854096076801',
          'loc': 'twitter',
          'name': 'Kati Persons',
          'text': 'I\'m becoming less and less of a cat person by the day.',
          'user': 'katiiiiileeeee'
        }]
      });

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

  it('Should add a unfiltered site', function () {
    scope.filter('reddit');
    scope.filter('reddit');
    expect(scope.filtered).toEqual(['twitter', 'instagram', 'reddit']);
  });

  it('Shuffle should return a different array', function () {
    var arr = [1, 2, 3, 4, 5];
    var ret = scope.shuffle(arr);
    expect(ret).not.toEqual([1,2,3,4,5]);
  });

  it('Search should return something on a valid string', function() {
    scope.query = 'cat';
    scope.search();
    $httpBackend.flush();
    expect(scope.response.length).toBe(3);
  });

  it('Should return correct values with timeAgo()', function() {
    var d = new Date();
    expect(scope.timeAgo(Math.floor(d/1000) - 1)).toBe('1 second ago');

    d = new Date();
    expect(scope.timeAgo(Math.floor(d/1000) - 1*60)).toBe('1 minute ago');

    d = new Date();
    expect(scope.timeAgo(Math.floor(d/1000) - 1*60*60)).toBe('1 hour ago');

    d = new Date();
    expect(scope.timeAgo(Math.floor(d/1000) - 1*60*60*24)).toBe('1 day ago');

    d = new Date();
    expect(scope.timeAgo(Math.floor(d/1000) - 1*60*60*24*30)).toBe('1 month ago');

    d = new Date();
    expect(scope.timeAgo(Math.floor(d/1000) - 1*60*60*24*30*12)).toBe('1 year ago');
  });
});
