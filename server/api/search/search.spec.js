'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var grab = require('./grab.js');
var result;

describe('GET /api/search', function() {
  this.timeout(20000);

  it('should respond with Object with each social media as keys', function(done) {
    request(app)
      .get('/api/search?q=hello+there')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        result = res.body;
        result.should.be.instanceof(Object);
        result.should.have.keys('twitter', 'instagram', 'reddit');
        done();
      });
  });

  it('should respond with Object with Instagram information', function(done) {
    
    result.instagram.should.be.instanceof(Array);
    result.instagram[0].link.should.be.instanceof(String);
    done();

  });

  it('should respond with Object with Reddit information', function(done) {
    
    result.reddit.should.be.instanceof(Array);
    result.reddit[0].link.should.be.instanceof(String);
    done();

  });

  it('should handle Instagram error', function(done) {
    
    grab.instagram('dog', function (result){
      result.should.have.keys('error');
      done();
    }, '1');
  });

  it('should respond with 404 when calling non existent route', function(done) {
    
    request(app)
      .get('/api/call')
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        done();
        });
      });

  it('should send index.html', function(done) {
    
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        done();
        });
      });


});
