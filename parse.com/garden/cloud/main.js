var async = require('cloud/node_modules/async/lib/async.js');
var config = require('cloud/config.js');

// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("garden", function(request, response) {

  Parse.Cloud.httpRequest({
    url: 'https://api.particle.io/oauth/token',
    method: 'POST',
    headers: {
      "Authorization": "Basic cGFydGljbGU6cGFydGljbGU=",
      "Content-type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=password&username="+config.username+"&password="+config.password+"&expires_in=60"
  }).then(function(httpResponse) {
      //response.success(httpResponse);
      var access_token = (httpResponse.data.access_token);
      var deviceid = config.devideid;
      var variables = ["temp", "humidity"];
      var result = {}

      var getVariable = function(variable, callback) {
        Parse.Cloud.httpRequest({
          url: 'https://api.particle.io/v1/devices/'+deviceid+'/'+variable+'?access_token='+access_token,
          method: 'GET'
         }).then(function(httpResponse) {
            result[variable] = httpResponse.data.result;
            callback();
          }, function(httpResponse) {
            result[variable] = -1;
            callback();
          }
        );
      };

      async.map(variables, getVariable, function() {
        response.success(result);
      });
    }, function(httpResponse) {
      response.error(httpResponse);
    }
  );
});


