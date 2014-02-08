(function() {
  var NODE_TYPES, RSVP, acorn, combineHashes, computeHash, fingerprintPattern, fs, nodeWalk, projectUtils, treeUtils, walk, _,
    __hasProp = {}.hasOwnProperty;

  fs = require('fs');

  _ = require('lodash');

  RSVP = require('rsvp');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  NODE_TYPES = require('./types').types;

  projectUtils = {
    getPatternFile: function(name) {
      return "analysis/patterns/" + name + ".js";
    },
    getFingerprintFile: function(name) {
      return "analysis/fingerprints/" + name + ".json";
    }
  };

  treeUtils = {
    isSubTree: function(obj) {
      if (obj == null) {
        return false;
      }
      if (_.isArray(obj) && obj.length > 0) {
        return obj[0].type != null;
      } else {
        return obj.type != null;
      }
    },
    getChildren: function(node) {
      var childNode, children, h, k, prop, v, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
      children = [];
      for (k in node) {
        if (!__hasProp.call(node, k)) continue;
        v = node[k];
        if ((v != null ? v.type : void 0) != null) {
          children.push(v);
        } else if (_.isArray(v) && v.length) {
          for (_i = 0, _len = v.length; _i < _len; _i++) {
            childNode = v[_i];
            if (childNode.type != null) {
              children.push(childNode);
            }
          }
        }
      }
      if ((_ref = node.type) === 'LetStatement' || _ref === 'LetExpression') {
        _ref1 = node.head;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          h = _ref1[_j];
          children.push(h.id);
          if (h.init != null) {
            children.push(h.init);
          }
        }
      } else if ((_ref2 = node.type) === 'ObjectExpression' || _ref2 === 'ObjectPattern') {
        _ref3 = node.properties;
        for (_k = 0, _len2 = _ref3.length; _k < _len2; _k++) {
          prop = _ref3[_k];
          children.push(prop.key);
          children.push(prop.value);
        }
      }
      return children;
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
      var _i, _len, _ref, _results;
      _ref = treeUtils.getChildren(node);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        _results.push(child.hash);
      }
      return _results;
    })();
    hash = hashes.length ? combineHashes(hashes) : {};
    hash[node.type] = hash[node.type] != null ? hash[node.type] + 1 : 1;
    return hash;
  };

  nodeWalk = function(node, fn, fnMap) {
    var child, _i, _len, _ref;
    _ref = treeUtils.getChildren(node);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      nodeWalk(child, fn, fnMap);
    }
    if ((fnMap != null ? fnMap[node.type] : void 0) != null) {
      fnMap[node.type](node);
    }
    if (fn != null) {
      return fn(node);
    }
  };

  fingerprintPattern = function(patternName) {
    var exportFingerprint, fingerprintFile, generateFingerprint, patternFile;
    patternFile = projectUtils.getPatternFile(patternName);
    fingerprintFile = projectUtils.getFingerprintFile(patternName);
    generateFingerprint = function() {
      return new RSVP.Promise(function(resolve, reject) {
        return fs.readFile(patternFile, 'utf8', function(err, jsFile) {
          var ast, nodeFn, stringifiedAST;
          if (err != null) {
            return reject(err);
          }
          ast = acorn.parse(jsFile);
          stringifiedAST = JSON.stringify(ast, null, 4);
          nodeFn = function(node) {
            return node.hash = computeHash(node);
          };
          nodeWalk(ast, nodeFn);
          return resolve(ast);
        });
      });
    };
    exportFingerprint = function(ast) {
      return new RSVP.Promise(function(resolve, reject) {
        if (ast.hash != null) {
          return fs.writeFile(fingerprintFile, JSON.stringify(ast.hash), function(err) {
            if (err != null) {
              return reject(err);
            } else {
              return resolve("Saved fingerprint for pattern " + patternName + ".");
            }
          });
        } else {

        }
      });
    };
    return generateFingerprint().then(exportFingerprint);
  };

  fingerprintPattern('iterator').then(function(msg) {
    return console.log(msg);
  });

}).call(this);
