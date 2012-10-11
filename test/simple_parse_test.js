/*!
 * Module dependencies.
 */
var testCase = require('nodeunit').testCase
  , nodeunit = require('nodeunit')
  , Typeit = require('../lib/typeit').Typeit;

exports.setUp = function(callback) {
  callback();
}

exports.tearDown = function(callback) {
  callback();
}

exports['Should correctly extract basic information for a class'] = function(test) {
  var typeif = new Typeit();
  var result = typeif.parse_file(process.cwd() + '/test/test_classes/simple_class.js');
  console.dir(result)
  test.done();
};

exports['Should correctly extract basic information for a module'] = function(test) {
  var typeif = new Typeit();
  var result = typeif.parse_module(process.cwd() + '/test/test_modules/simple');
  // console.dir(result)
  test.done();
};

exports['Should correctly build ts file for module'] = function(test) {
  var typeif = new Typeit();
  typeif.module(process.cwd() + '/test/test_modules/simple', function(err, result) {
    console.dir(err)
    console.dir(result)
    test.done();
  });
};

/**
 * Retrieve the server information for the current
 * instance of the db client
 * 
 * @ignore
 */
var numberOfTestsRun = Object.keys(this).length - 2;