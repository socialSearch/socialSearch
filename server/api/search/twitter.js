var http = require('http');
var url = require('url');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencode = require('urlencode');
console.log()


if ( (process.env.NODE_ENV === 'production') || (process.env.NODE_ENV === 'ci')){  
}
else{
  var config = require('../../config/config.js');
}


var querystring = require('querystring');


var twitterErrorCount = 0;
var twitterResponse = {};
var port = process.env.PORT || 3000;

if ( (process.env.NODE_ENV === 'production') || (process.env.NODE_ENV === 'ci')){  
  var twitterKey = process.env.TWITTER_KEY;
}
else{
  var twitterKey = config.twitterKey;
}

console.log(twitterKey);
var searchString = 'dog food'
var getToken = function(callback){

  var form = {
      grant_type: 'client_credentials'
  };

  var formData = querystring.stringify(form);
  var contentLength = formData.length;
if ( (process.env.NODE_ENV === 'production') || (process.env.NODE_ENV === 'ci')){  
  var auth = process.env.BASIC_AUTH;
}
else{
  var auth =  config.basicAuth;
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

    console.log(tweetsResponse);
    if (callback){

    callback(tweetsResponse);
    }
  }); 
}

}





module.exports.getTweets('dr pepper');

