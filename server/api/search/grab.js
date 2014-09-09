'use strict';

var _ = require('lodash');
var request = require('request');
var instagramKey = process.env.INSTAGRAM_KEY;

//setting our error counter
var instagramError = 0;
var redditError = 0;

exports.instagram = function(query, cb, failure) {
  var storage = [];

  if(failure){
    instagramKey = failure;
  }

  request('https://api.instagram.com/v1/tags/'+ query.split(" ").join("") +'/media/recent?client_id=' + instagramKey, function(error, response, result){
    
    var parseResult = JSON.parse(result);

    //handling errors and retries
    if( parseResult.meta.hasOwnProperty('error_type') ){
      if(instagramError < 3){
        instagramError++;
        exports.instagram(query, cb);
        return
      } else {
        console.log('instagram error', parseResult.meta);
        cb({'error': parseResult.meta});
        instagramError = 0;
        return
      }
    }
    //resetting counter
    instagramError = 0;

    var data = parseResult.data;

    if( data ) {
      //grabing specific data from instagram
      data.forEach(function(value){
        var obj = {};
        obj.picture = value.images.standard_resolution.url;
        obj.user = value.user.username;
        obj.proPic = value.user.profile_picture;
        obj.link = value.link;
        obj.date = value.created_time;
        storage.push(obj);
      });
    }

    //passing the array of data into the callback
    cb( storage );
  });
};

exports.reddit = function(query, cb) {
  var storage = [];

  request('http://www.reddit.com/search.json?q='+ query, function(error, response, result){
    //handling 504 errors sent back by reddit
    if(response.statusCode ===  504 && redditError < 3){
      redditError++;
      exports.reddit(query, cb);
      return;
    } else if (response.statusCode ===  504 && redditError >= 3) {
      cb({'error': '504'});
      redditError = 0;
      return;
    }

    //resetting counter
    redditError = 0;
    // console.log('reddit statuscode', response.statusCode );

    //parsing the json string
    // console.log(JSON.parse(result).data.children );
    var data = JSON.parse(result).data.children;

    if( data ) {
      //grabing specific data from reddit
      data.forEach(function(value){
        var obj = {};
        obj.domain = value.data.domain;
        obj.author = value.data.author;
        obj.score = value.data.score;
        obj.link = value.data.url;
        obj.title = value.data.title;
        obj.num_comments = value.data.num_comments;
        obj.subreddit = value.data.subreddit;
        obj.date = value.data.created;
        storage.push(obj);
      });
    }

    //passing array of data into the callback
    cb( storage );
  });

};