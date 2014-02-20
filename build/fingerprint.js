(function() {
  var NODE_TYPES, RSVP, acorn, combineHashes, computeHash, fingerprintPattern, fs, generateFingerprint, getChildren, identifyPattern, nodeWalk, projectUtils, q, utils, walk, _, _ref,
    __hasProp = {}.hasOwnProperty;

  fs = require('fs');

  _ = require('lodash');

  RSVP = require('rsvp');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  q = require('./utils').q;

  _ref = require('./ast'), getChildren = _ref.getChildren, nodeWalk = _ref.nodeWalk;

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

  combineHashes = function(hashes) {
    var combined, count, h, nodeType, _i, _len;
    combined = {};
    for (_i = 0, _len = hashes.length; _i < _len; _i++) {
      h = hashes[_i];
      for (nodeType in h) {
        if (!__hasProp.call(h, nodeType)) continue;
        count = h[nodeType];
        if (combined[nodeType] == null) {
          combined[nodeType] = 0;
        }
        combined[nodeType] += count;
      }
    }
    return combined;
  };

  computeHash = function(node) {
    var child, hash, hashes;
    hashes = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = getChildren(node);
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        child = _ref1[_i];
        _results.push(child.hash);
      }
      return _results;
    })();
    hash = hashes.length ? combineHashes(hashes) : {};
    hash[node.type] = hash[node.type] != null ? hash[node.type] + 1 : 1;
    return hash;
  };

  generateFingerprint = function(fileName) {
    return q(fs.readFile, fileName, 'utf8').then(function(jsFile) {
      var ast, storeNodeHash;
      ast = acorn.parse(jsFile);
      storeNodeHash = function(node) {
        return node.hash = computeHash(node);
      };
      nodeWalk(ast, storeNodeHash);
      return ast;
    });
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
      targetHash: generateFingerprint(targetFile).then(utils.getProp('hash')),
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
