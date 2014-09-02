'use strict';

var _ = require('lodash');
var request = require('request');
var instagramKey = process.env.INSTAGRAM_KEY;

//setting our error counter
var instagramError = 0;
var redditError = 0;

exports.instagram = function(query, cb) {
  var storage = [];

  request('https://api.instagram.com/v1/tags/'+ query.split(" ").join("") +'/media/recent?client_id=' + instagramKey, function(error, response, result){
    //handling errors and retries
    if(error && instagramError < 3){
      console.log('instagram error', error);
      instagramError++;
      exports.instagram(query, cb);
      return;
    } else if (error && instagramError >= 3){
      console.log('instagram error', error);
      cb(error);
      instagramError = 0;
      return;
    }

    //resetting counter
    instagramError = 0;

    //parsing the json string
    var data = JSON.parse(result).data;

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
      console.log('reddit 504 error');
      redditError++;
      exports.reddit(query, cb);
      return;
    } else if (response.statusCode ===  504 && redditError >= 3) {
      cb({'error': '504'});
      redditError = 0;
      return;
    //handling other errors
    } else if (error && redditError < 3) {
      console.log('reddit error', error);
      redditError++;
      exports.reddit(query, cb);
      return;
    } else if ( error && redditError >= 3) {
      console.log('reddit error', error);
      cb(error);
      redditError = 0;
      return;
    }

    //resetting counter
    redditError = 0;
    // console.log('reddit statuscode', response.statusCode );

    //parsing the json string
    var data = JSON.parse(result).data.children;

    if( data ) {
      //grabing specific data from reddit
      data.forEach(function(value){
        var obj = {};
        obj.title = value.data.title;
        obj.name = value.data.name;
        obj.link = value.data.url;
        obj.date = value.data.created;
        storage.push(obj);
      });
    }

    //passing array of data into the callback
    cb( storage );
  });

};