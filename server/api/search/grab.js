'use strict';

var _ = require('lodash');
var request = require('request');
var instagramKey = require('./clientid.js').instagramKey;

exports.instagram = function(query, cb) {
  var storage = [];

  request('https://api.instagram.com/v1/tags/'+ query.split(" ").join("") +'/media/recent?client_id=' + instagramKey, function(error, response, result){
    if(error){console.log(error);}
    var data = JSON.parse(result).data;

    data.forEach(function(value){
      var obj = {};
      obj.picture = value.images.standard_resolution.url;
      obj.user = value.user.username;
      obj.proPic = value.user.profile_picture;
      obj.link = value.link;
      obj.date = value.created_time;
      storage.push(obj);
    });

    cb( storage );
  });
};

exports.reddit = function(query, cb) {
  var storage = [];

  request('http://www.reddit.com/search.json?q='+ query, function(error, response, result){
    if(error){console.log(error);}
    var data = JSON.parse(result).data.children;

    data.forEach(function(value){
      var obj = {};
      obj.title = value.data.title;
      obj.name = value.data.name;
      obj.link = value.data.url;
      obj.date = value.data.created;
      storage.push(obj);
    });

    cb( storage );
  });

};