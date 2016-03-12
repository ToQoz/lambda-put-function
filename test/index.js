var test = require('tape');
var assign = require('object-assign');

var put = require('..')

var lambdaMethods = function() {
  return {
    _called: [],
    createFunction: function(params, cb) {
      this._called.push('createFunction');
      cb(null, {});
    },
    updateFunctionCode: function(params, cb) {
      this._called.push('updateFunctionCode');
      cb(null, {});
    },
    updateFunctionConfiguration: function(params, cb) {
      this._called.push('updateFunctionConfiguration');
      cb(null, {});
    }
  };
};

test("put() calls create if the function doesn't exist", function (t) {
  t.plan(3);

  var lambda = assign(lambdaMethods(), {
    getFunction: function(params, cb) {
      cb({statusCode: 404}, null);
    }
  });

  put(lambda, {}, function() {
    t.equal(includes(lambda._called, 'createFunction'), true);
    t.equal(includes(lambda._called, 'updateFunctionCode'), false);
    t.equal(includes(lambda._called, 'updateFunctionConfiguration'), false);
  });
});

test("put() calls update() if the function exists", function (t) {
  t.plan(3);

  var lambda = assign(lambdaMethods(), {
    getFunction: function(params, cb) {
      cb(null, {Code: {}, Configuration: {}});
    }
  });

  put(lambda, {}, function() {
    t.equal(includes(lambda._called, 'createFunction'), false);
    t.equal(includes(lambda._called, 'updateFunctionCode'), true);
    t.equal(includes(lambda._called, 'updateFunctionConfiguration'), true);
  });
});

test("put() calls given cb() with error if unexpected error occurs on exists()", function (t) {
  t.plan(4);

  var lambda = assign(lambdaMethods(), {
    getFunction: function(params, cb) {
      cb({statusCode: 500}, {Code: {}, Configuration: {}});
    }
  });

  put(lambda, {}, function(err, data) {
    t.equal(includes(lambda._called, 'createFunction'), false);
    t.equal(includes(lambda._called, 'updateFunctionCode'), false);
    t.equal(includes(lambda._called, 'updateFunctionConfiguration'), false);
    t.deepEqual(err, {statusCode: 500});
  });
});

function includes(list, element) {
  return list.indexOf(element) !== -1;
}
