/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var grab = require('./grab.js');
var request = require('request');
var twitter = require('./twitter.js');

// Get list of things
exports.index = function(req, res) {

  var query = req.query.q;

  //our data
  var data = {};

  //our toggle
  var toggle = {};
  toggle.twitter = false;
  toggle.instagram = false;
  toggle.reddit = false;

  //checks if all data have been received
  var checkToggle = function(){
    if(toggle.twitter === true && toggle.instagram === true && toggle.reddit === true){
      if (req.query.hasOwnProperty('callback')){
        res.jsonp(data);
      }
      else{
        res.send(data);
      }
    }
  };

  //grabing instagram data
  grab.instagram(query, function(result){
    data.instagram = result;
    toggle.instagram = true;
    checkToggle();
  });

  //grabbing reddit data
  grab.reddit(query, function(result){
    data.reddit = result;
    toggle.reddit = true;
    checkToggle();
  });

  //grabbing twitter data
  twitter.getTweets(query, function(result){
    data.twitter = result;
    toggle.twitter = true;
    checkToggle();
  });

};