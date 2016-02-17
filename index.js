var assign = require("object-assign");

module.exports = function(lambda, params, cb) {
  cb = cb || function() {};

  exists(lambda, params.FunctionName, function(err, exists) {
    if (err) {
      cb(err, null);
    } else {
      if (exists) {
        update(lambda, params, cb);
      } else {
        create(lambda, params, cb);
      }
    }
  });
}

function create(lambda, params, cb) {
  lambda.createFunction(params, cb);
}

function update(lambda, params, cb) {
  var params = assign({}, params);
  delete params.Runtime;

  var code = assign({}, params.Code, {
    FunctionName: params.FunctionName,
    Publish: !!params.Publish,
  });
  delete params.Code;
  delete params.Publish;

  return lambda.updateFunctionCode(code, function(err, data) {
    if (err) {
      cb(err, null);
    } else {
      lambda.updateFunctionConfiguration(params, cb)
    }
  });
}

function exists(lambda, functionName, cb) {
  var params = {
    FunctionName: functionName
  };

  lambda.getFunction(params, function(err, data) {
    if (err) {
      if (err.statusCode === 404) {
        // not found
        cb(null, false);
      } else {
        // unexpected error
        cb(err, undefined);
      }
    } else {
      // found
      cb(null, true);
    }
  });
}
