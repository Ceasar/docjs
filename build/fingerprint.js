(function() {
  var acorn, combineHashes, computeHash, fs, isSubTree, walk, _,
    __hasProp = {}.hasOwnProperty;

  fs = require('fs');

  _ = require('lodash');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  isSubTree = function(obj) {
    if (obj == null) {
      return false;
    }
    if (_.isArray(obj) && obj.length > 0) {
      return obj[0].type != null;
    } else {
      return obj.type != null;
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
    var child, hash, hashes, k, v, _i, _len;
    hashes = [];
    for (k in node) {
      if (!__hasProp.call(node, k)) continue;
      v = node[k];
      if (v.hash != null) {
        hashes.push(v.hash);
      } else if (_.isArray(v)) {
        for (_i = 0, _len = v.length; _i < _len; _i++) {
          child = v[_i];
          if (child.hash != null) {
            hashes.push(child.hash);
          }
        }
      }
    }
    hash = hashes.length ? combineHashes(hashes) : {};
    hash[node.type] = hash[node.type] != null ? hash[node.type] + 1 : 1;
    return hash;
  };

  fs.readFile('patterns/iterator.js', 'utf8', function(err, jsFile) {
    var ast, functions, nodeTypes, registerNodeType, state, stringifiedAST, t, _i, _len;
    if (err) {
      return console.log(err);
    }
    ast = acorn.parse(jsFile);
    stringifiedAST = JSON.stringify(ast, null, 4);
    state = {};
    functions = {};
    nodeTypes = ['BlockStatement', 'ExpressionStatement', 'IfStatement', 'WhileStatement', 'ForStatement', 'ObjectExpression', 'NewExpression'];
    registerNodeType = function(type) {
      return function(node, state, c) {
        var k, n, v, _i, _len;
        for (k in node) {
          if (!__hasProp.call(node, k)) continue;
          v = node[k];
          if (!isSubTree(v)) {
            continue;
          }
          if (_.isArray(v)) {
            for (_i = 0, _len = v.length; _i < _len; _i++) {
              n = v[_i];
              c(n, state);
            }
          } else {
            c(v, state);
          }
        }
        return node.hash = computeHash(node);
      };
    };
    for (_i = 0, _len = nodeTypes.length; _i < _len; _i++) {
      t = nodeTypes[_i];
      functions[t] = registerNodeType(t);
    }
    walk.recursive(ast, state, functions);
    debugger;
  });

}).call(this);
