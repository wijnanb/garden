var async = require('cloud/node_modules/async/lib/async.js');
var config = require('cloud/config.js');

Parse.Cloud.job("garden", function(request, status) {
  var deviceid = config.devideid;
  var variables = ["temp", "humidity"];
      
  status.message = "fetching " + variables.join(', ') + " from device " + deviceid;

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
        var Measurement = Parse.Object.extend("Measurement");
        var measurement = new Measurement();
        measurement.set(result);

        measurement.save(null, {
          success: function(gameScore) {
            status.success(JSON.stringify(result));
          },
          error: function(gameScore, error) {
            status.error(error.message);
          }
        });
      });
    }, function(httpResponse) {
      status.error(JSON.stringify(result));
    }
  );
});
