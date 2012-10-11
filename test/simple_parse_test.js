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
  var result = typeif.parse('./test_classes/simple_class.js');
  console.dir(result)
  test.done();
};

/**
 * Retrieve the server information for the current
 * instance of the db client
 * 
 * @ignore
 */
var numberOfTestsRun = Object.keys(this).length - 2;