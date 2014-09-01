'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var grab = require('./grab.js');

describe('GET /api/search', function() {

  it('should respond with Object with each social media as keys', function(done) {
    request(app)
      .get('/api/search?q=hello+there')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        res.body.instagram.should.be.instanceof(Array);
        done();
      });
  });

  it('should respond with Object with Instagram information', function(done) {
    
    grab.instagram('test', function (results){

      results[0].link.should.be.instanceof(String);
      done();
    });

  });

  it('should respond with Object with Reddit information', function(done) {
    
    grab.reddit('test', function (results){

      results[0].link.should.be.instanceof(String);
      done();
    });

  });

});