var http = require('http');
var url = require('url');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencode = require('urlencode');
var querystring = require('querystring');
var Promise = require("bluebird");

 
var twitterErrorCount = 0;
var twitterResponse = {};
var port = process.env.PORT || 3000;

// var twitterKey = process.env.TWITTER_KEY;

var twitterToken;

// var getToken = function(callback){

//   return new Promise(function (resolve, reject) {

//     var form = {
//         grant_type: 'client_credentials'
//     };

//     var formData = querystring.stringify(form);
//     var contentLength = formData.length;
//     request({
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },

//         auth: {
//             'user': process.env.TWITTER_API_KEY,
//             'pass': process.env.TWITTER_API_SECRET
//         },
//         uri: 'https://api.twitter.com/oauth2/token',
//         body: formData,
//         method: 'POST'
//         }, function (err, res, body) {
//           console.log(err);
//           twitterToken = JSON.parse(body).access_token;
//           resolve();
//       });
//     });
// };

module.exports = {

getToken: function(){

  return new Promise(function (resolve, reject) {

    var form = {
        grant_type: 'client_credentials'
    };

    var formData = querystring.stringify(form);
    var contentLength = formData.length;
    request({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },

        auth: {
            'user': process.env.TWITTER_API_KEY,
            'pass': process.env.TWITTER_API_SECRET
        },
        uri: 'https://api.twitter.com/oauth2/token',
        body: formData,
        method: 'POST'
        }, function (err, res, body) {
          console.log(err);
          twitterToken = JSON.parse(body).access_token;
          resolve();
      });
    });
},

getTweets: function(search, callback){

  if ( !twitterToken ){
    module.exports.getToken()
    .done(function() {
      module.exports.sendRequest(search, callback)
    }, function(err) {
    });
  }

  else{
    module.exports.sendRequest(search, callback);
  }
},

sendRequest : function(search, callback){

  if ( twitterErrorCount > 5 ){
    return;
  }

  var options = {
      url: 'https://api.twitter.com/1.1/search/tweets.json?lang=en&q=' + search,
      headers: {
          'Authorization': 'Bearer ' + twitterToken
      }
    };

  request( options, function (error, response, body){

    if (JSON.parse(body).hasOwnProperty('errors')){
      twitterErrorCount++;
      console.log(error);
      if (callback){
        callback(['error']);
      }
      return; 
    }

    twitterErrorCount = 0;
    var tweets = JSON.parse(body);
    var tweetsResponse = [];

    for ( var i = 0; i < tweets.statuses.length; i++){
      var tempObj = {};
      var thisTweet = tweets.statuses[i];
      tempObj.text = thisTweet.text;
      tempObj.name = thisTweet.user.name;
      tempObj.user = thisTweet.user.screen_name;
      tempObj.link = 'https://twitter.com/' + thisTweet.user.id + '/statuses/' + thisTweet.id_str;
      tempObj.data = thisTweet.created_at;
      if ( thisTweet.entities.media ){
        tempObj.media_link = thisTweet.entities.media[0].media_url;
      }
      tweetsResponse.push(tempObj);
    }

    if (callback){

    callback(tweetsResponse);

    }
  }); 
}

}

// getToken();