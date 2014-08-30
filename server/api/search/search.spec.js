'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /api/search', function() {

  it('should respond with Object with each social media as keys', function(done) {
    request(app)
      .get('/api/search?q=hello+there')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object);
        res.body.facebook.should.be.instanceof(Array);
        done();
      });
  });

  // it('should respond with an Array for each Key', function(done) {
  //   request(app)
  //     .get('/api/search')
  //     .expect(200)
  //     .end(function(err, res) {
  //       if (err) return done(err);
  //       res.body.should.be.instanceof(Object);
  //       done();
  //     });
  // });




});