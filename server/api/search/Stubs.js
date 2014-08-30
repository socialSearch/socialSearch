// Methods for stubbing HTTP requests and responses
module.exports = {

  response: function() {
    this._ended = false;
    this._responseCode = null;
    this._headers = null;
    this._data = null;
    var self = this;
    this.writeHead = function(responseCode, headers) {
      console.log('WriteHead called with ' + responseCode);
      self._responseCode = responseCode;
      self._headers = headers;
    };
    this.end = function(data) {
      console.log('Response.end called.');
      self._ended = true;
      self._data = data;
    };
  },

  request: function(url, method, postdata) {
    this.url = url;
    this.method = method;
    this._postData = postdata;
    this.setEncoding = function(type) {
      //ignore
    };
    var self = this;
    this.addListener = this.on = function(type, callback) {
      if (type == 'data') {
        callback(JSON.stringify(self._postData));
      }
      if (type == 'end') {
        callback();
      }
    };
  }

};
