'use strict';

var should = require('should');
var request = require('supertest');
var twitter = require('./twitter.js')


describe('Twitter Search', function() {

  it('should respond with Object with Tweet information', function(done) {
    
    twitter.getTweets('dog', function (results){
      results[0].text.should.be.instanceof(String);
      done();
    });

  });

  it('should handle errors', function(done) {
    
    twitter.getTweets('!@#!@##$%$%&^%*', function (results){
      results[0].should.equal('error');
      done();
    }, 'blah');
   

  });


});