var http = require('http');
var url = require('url');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencode = require('urlencode');
if ( process.env.NODE_ENV !== 'production'){
  var config = require('../../config/config.js');
}
var querystring = require('querystring');


var twitterErrorCount = 0;
var twitterResponse = {};
var port = process.env.PORT || 3000;

if ( process.env.NODE_ENV !== 'production'){
  var twitterKey = config.twitterKey;
}
else{
  var twitterKey = process.env.TWITTER_KEY;
}

var searchString = 'dog food'
var getToken = function(callback){

  var form = {
      grant_type: 'client_credentials'
  };

  var formData = querystring.stringify(form);
  var contentLength = formData.length;
if ( process.env.NODE_ENV !== 'production'){
  var auth =  config.basicAuth;
}
else{
  var auth = process.env.BASIC_AUTH;
}

  request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': auth
      },
      uri: 'https://api.twitter.com/oauth2/token',
      body: formData,
      method: 'POST'
    }, function (err, res, body) {
      twitterKey = JSON.parse(body).access_token;
      console.log(twitterKey);
    });
if ( callback ){
  callback();
}

};

module.exports = {

getTweets : function(search, callback){

  if ( twitterErrorCount > 5 ){
    return;
  }
  var options = {
      url: 'https://api.twitter.com/1.1/search/tweets.json?lang=en&q=' + search,
      headers: {
          'Authorization': 'Bearer ' + twitterKey
      }
    };

  request( options, function (error, response, body){

    if (JSON.parse(body).hasOwnProperty('errors')){
      console.log(body);
      getToken( module.exports.getTweets(search) );
      twitterErrorCount++;
      return; 
    }
    twitterErrorCount = 0;
    var tweets = JSON.parse(body);
    var tweetsResponse = [];

    for ( var i = 0; i < tweets.statuses.length; i++){
      var tempObj = {};
      tempObj.text = tweets.statuses[i].text;
      tempObj.name = tweets.statuses[i].user.name;
      tempObj.user = tweets.statuses[i].user.screen_name;
      tempObj.link = 'https://twitter.com/' + tweets.statuses[i].user.screen_name + '/statuses/' + tweets.statuses[i].id;
      tempObj.data = tweets.statuses[i].created_at;
      if ( tweets.statuses[i].entities.media ){
        // tempObj.media_link = {};
        tempObj.media_link = tweets.statuses[i].entities.media[0].media_url;
      }
      tweetsResponse.push(tempObj);
    }

    if (callback){

    callback(tweetsResponse);
    }
  }); 
}

}





// module.exports.getTweets('mouse');

