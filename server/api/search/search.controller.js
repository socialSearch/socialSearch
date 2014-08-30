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
var sample = require('./sampleData.js')
var request = require('request');

// Get list of things
exports.index = function(req, res) {
  var query = req.query.q;
  console.log(req.query);

  // request('http://twitter.com/search/'+query, function(error, response, body){
  //   if(error){console.log(error);}
  //   console.log(body);
  // });

  var data = {};
  data.twitter = sample.tweets;
  data.instagram = [query];
  data.facebook = [query];

  res.send(data);
};
