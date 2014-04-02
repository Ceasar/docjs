(function() {
  var NODE_TYPES, RSVP, acorn, astUtils, fingerprintPattern, fs, generateFingerprint, identifyPattern, projectUtils, q, utils, walk, _;

  fs = require('fs');

  _ = require('lodash');

  RSVP = require('rsvp');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  q = require('./utils').q;

  astUtils = require('./ast');

  NODE_TYPES = require('./types').types;

  utils = {
    getProp: function(propName) {
      return function(object) {
        return object[propName];
      };
    }
  };

  projectUtils = {
    getPatternFile: function(name) {
      return "analysis/patterns/" + name + ".js";
    },
    getFingerprintFile: function(name) {
      return "analysis/fingerprints/" + name + ".json";
    },
    getTargetFile: function(name) {
      return "analysis/targets/" + name + ".js";
    }
  };

  generateFingerprint = function(fileName) {
    return q(fs.readFile, fileName, 'utf8').then(acorn.parse).then(astUtils.getNodeTypes);
  };

  fingerprintPattern = function(patternName) {
    var exportFingerprint, fingerprintFile, patternFile, successMsg;
    patternFile = projectUtils.getPatternFile(patternName);
    fingerprintFile = projectUtils.getFingerprintFile(patternName);
    successMsg = function(name) {
      return "Saved fingerprint for pattern " + name + ".";
    };
    exportFingerprint = function(ast) {
      var contents;
      if (ast.hash != null) {
        contents = JSON.stringify(ast.hash);
        return q(fs.writeFile, fingerprintFile, contents).then(successMsg);
      } else {
        return console.error("No fingerprint found to export");
      }
    };
    return generateFingerprint(patternFile).then(exportFingerprint);
  };

  identifyPattern = function(target, pattern) {
    var fingerprintFile, targetFile;
    targetFile = projectUtils.getTargetFile(target);
    fingerprintFile = projectUtils.getFingerprintFile(pattern);
    return RSVP.hash({
      targetHash: generateFingerprint(targetFile),
      fingerprint: q(fs.readFile, fingerprintFile, 'utf8').then(JSON.parse)
    }).then(function(_arg) {
      var fingerprint, targetHash;
      targetHash = _arg.targetHash, fingerprint = _arg.fingerprint;
      debugger;
    })["catch"](console.error);
  };

  identifyPattern('loops', 'iterator').then(function(msg) {
    return console.log(msg);
  });

  module.exports = {
    projectUtils: projectUtils,
    pattern: fingerprintPattern,
    identify: identifyPattern
  };

}).call(this);
