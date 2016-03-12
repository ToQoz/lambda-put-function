var crypto = require('crypto');
var assign = require("object-assign");
var deepEqual = require('deep-equal');

module.exports = function(lambda, params, cb) {
  cb = cb || function() {};

  get(lambda, params.FunctionName, function(err, data) {
    if (err) {
      cb(err, null);
    } else {
      if (data) {
        update(lambda, params, data, cb);
      } else {
        create(lambda, params, cb);
      }
    }
  });
}

function create(lambda, params, cb) {
  lambda.createFunction(params, cb);
}

function update(lambda, params, current, cb) {
  var params = assign({}, params);
  delete params.Runtime;

  var code = assign({}, params.Code, {
    FunctionName: params.FunctionName,
    Publish: !!params.Publish,
  });
  delete params.Code;
  delete params.Publish;

  var updateCode = function(params, cb) {
    if (params.ZipFile && checksum(params.ZipFile) === current.Configuration.CodeSha256) {
      cb(null, current.Code);
    } else {
      lambda.updateFunctionCode(params, cb);
    }
  };

  var updateConfiguration = function(params, cb) {
    // undefined だと diffが生れるのでとりあえず
    params.Description = params.Description || '';
    var currentConfiguration = objectReject(current.Configuration, ["Version", "CodeSha256", "CodeSize", "FunctionArn", "LastModified", "Runtime"])
    if (deepEqual(params, currentConfiguration)) {
      cb(null, current.Configuration)
    } else {
      lambda.updateFunctionConfiguration(params, cb)
    }
  };

  return updateCode(code, function(err, data) {
    if (err) {
      cb(err, null);
    } else {
      updateConfiguration(params, cb)
    }
  });
}

function get(lambda, functionName, cb) {
  var params = {
    FunctionName: functionName
  };

  lambda.getFunction(params, function(err, data) {
    if (err) {
      if (err.statusCode === 404) {
        // not found
        cb(null, null);
      } else {
        // unexpected error
        cb(err, undefined);
      }
    } else {
      // found
      cb(null, data);
    }
  });
}

function objectReject(obj, keys) {
  return Object.keys(obj).reduce(function(acc, k) {
    if (keys.indexOf(k) === -1) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
}

function checksum(data) {
  var hash = crypto.createHash('sha256');
  hash.update(params.ZipFile);
  return hash.digest('base64');
}
