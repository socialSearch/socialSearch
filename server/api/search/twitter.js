var http = require('http');
var url = require('url');
var request = require('request');
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencode = require('urlencode');
if ( !process.env.NODE_ENV){
  var config = require('../../config/config.js');
}
var querystring = require('querystring');


var twitterErrorCount = 0;
var twitterResponse = {};
var port = process.env.PORT || 3000;
var trendCounter = 0;
var trendStop;
var trendsObject = {};
// var app = express();
var trends = [];
if ( !process.env.NODE_ENV){
  var twitterKey = config.twitterKey;
}
else{
  var twitterKey = process.env.TWITTER_KEY;
}
// var auth = require('http-auth');
console.log(__dirname, 'diranme');
var foldername = __dirname + '/gif/';
fs.readdir(foldername, function(err, files){
  console.log(files);
});

var searchString = 'dog'
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);
// app.use('/bower_components',express.static(__dirname + '/gif/bower_components'));

// app.use('/',express.static(__dirname + '/gif/app'));
// console.log(__dirname+ '/gif', 'dirname');


// app.get('/newkey', function (req, res){

//   getToken();

// });

// app.get('/', function(req, res) {
//   res.sendFile(__dirname + '/gif/app/index.html');
// });


// app.get('/twitter', function(req, res){
//     res.send(twitterResponse);
//   }
// );

// app.post('/', function(req, res){

//   var giphyTerms = req.body;
//   var completeResponse = {};

//   var giphyUrl = "http://api.giphy.com/v1/gifs/search?q=" + giphyTerms + "&api_key=dc6zaTOxFJmzC&limit=100";
//   request(giphyUrl, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       var giphyUrls = [];
//       for ( var i = 0; i < JSON.parse(body).data.length; i++){
//         giphyUrls.push(JSON.parse(body).data[i].images.original.url);
//       }
//       completeResponse.giphy = giphyUrls;
//       res.send(completeResponse);
//     }
//   });
// });

// app.get('/popular', function(req, res){
//   var completeResponse = {};
//   var url = 'http://api.giphy.com/v1/gifs/trending?api_key=dc6zaTOxFJmzC&limit=100';
//   request(url, function(error, response, body){
//     if (!error && response.statusCode == 200) {
//       var giphyUrls = [];
//       for ( var i = 0; i < JSON.parse(body).data.length; i++){
//         giphyUrls.push(JSON.parse(body).data[i].images.original.url);
//       }
//     }
//     completeResponse.giphy = giphyUrls;

//     res.send(completeResponse);
//   });
// });


var getTrends = function(){

  if ( twitterErrorCount > 5 ){
    return;
  }
  var options = {
    // https://api.twitter.com/1.1/search/tweets.json?q=%23superbowl
      url: 'https://api.twitter.com/1.1/search/tweets.json?lang=en&q=' + searchString,
      headers: {
          'Authorization': 'Bearer ' + twitterKey
      }
    };


  request( options, function (error, response, body){

    if (JSON.parse(body).hasOwnProperty('errors')){
      console.log(body);
      getToken();
      twitterErrorCount++;
      return; 
    }
    twitterErrorCount = 0;
    // console.log(body.statuses[0]);
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

      console.log(tweetsResponse);
    
    // var trendsResult = JSON.parse(body)[0].trends;

    
    // for ( var i = 0; i < trendsResult.length; i++){ 
    //   trends.push(trendsResult[i].name);
    // }
    // console.log(trends);

    // trendStop = trendsResult.length - 1;
    // var counter = 0;
    //   for ( var k = 0; k < trends.length; k++){
    //     searchTerm = trends[k];
    //     searchTerm = searchTerm.split('');
    //     for ( var l = 0; l < searchTerm.length; l++){
    //       if ( searchTerm[l] === '#'){
    //         searchTerm[l] = '';
    //       }
    //     }

    //     var objectKey = trends[k];

    //     searchTerm = searchTerm.join('');

    //     getTrendGifs(searchTerm, function (){
    //       twitterResponse = parseGiphyObject(trendsObject);
    //     }); 
      
    // }
  }); 
};

// var getTrendGifs = function (searchTerm, callback){
//   // console.log(callback);
//   searchTerm = searchTerm.split(' ').join('+');
//   console.log(searchTerm);
//   var giphyUrl = "http://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=dc6zaTOxFJmzC";
//   console.log(giphyUrl, 'searchURL');
//         request(giphyUrl, function (error, response, body) {
//           // console.log(body);
//           if(JSON.parse(body).data[0]){

//           // var tempObject = JSON.parse(body).data[0];
//           // trendsObject[searchTerm] = [JSON.parse(body).data[0].images.original.url];
//           // searchTerm = searchTerm.split('+').join(' ');
//           trendsObject[searchTerm] = JSON.parse(body).data;
//           trendCounter++;
//             if (trendCounter >= trendStop){
//               console.log(trendCounter, 'line 103');
//               callback();
//               trendCounter = 0;
//             }

//           }
//           else{
//             trendCounter++;

//             if (trendCounter >= trendStop){
//               console.log(trendCounter, 'line 113');
//               callback();
//               trendCounter = 0;
//             }
//           }
//         });

// };


var getToken = function(){

  var form = {
      grant_type: 'client_credentials'
  };

  var formData = querystring.stringify(form);
  var contentLength = formData.length;
if ( !process.env.NODE_ENV){
  var auth =  config.basicAuth;
}
else{
  var auth = process.env.BASIC_AUTH;
}

  // var auth = process.env.BASIC_AUTH || config.basicAuth;
  console.log(auth);
  console.log(formData);
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
};


// var parseGiphyObject = function (obj){
//   var tempObj = {};

//   for ( var key in obj ){
//     tempObj[key] = [];
//     var topic = obj[key];
//     for ( var i = 0; i < obj[key].length; i++){
//       tempObj[key].push(topic[i].images['original']['url']);
//     }
//   }
//     return tempObj;

// };

getTrends();

// setInterval(getTrends, 1000000);

// var server = app.listen(port, function() {
//   console.log("Listening on port %d", port);
// });