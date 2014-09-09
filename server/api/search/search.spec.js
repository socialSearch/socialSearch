'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var grab = require('./grab.js');
var result;

describe('GET /api/search', function() {
  this.timeout(5000);

  it('should respond with Object with each social media as keys', function(done) {
    request(app)
      .get('/api/search?q=hello+there')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        result = res.body;
        result.should.be.instanceof(Object);
        result.should.have.keys('twitter', 'instagram', 'reddit');
        console.log(process.env.INSTAGRAM_KEY);
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

});