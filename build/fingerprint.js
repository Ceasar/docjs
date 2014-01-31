(function() {
  var acorn, combineHashes, computeHash, fs, getChildren, isSubTree, nodeTypes, nodeWalk, walk, _,
    __hasProp = {}.hasOwnProperty;

  fs = require('fs');

  _ = require('lodash');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  nodeTypes = require('../src/types').types;

  getChildren = function(node) {
    var childNode, children, h, k, prop, v, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _ref3;
    children = [];
    debugger;
    for (k in node) {
      if (!__hasProp.call(node, k)) continue;
      v = node[k];
      if ((v != null ? v.type : void 0) != null) {
        children.push(v);
      } else if (_.isArray(v) && v.length) {
        if (v.type != null) {
          for (_i = 0, _len = v.length; _i < _len; _i++) {
            childNode = v[_i];
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
  };

  nodeWalk = function(node, fn, fnMap) {
    var child, _i, _len, _ref;
    _ref = getChildren(node);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      nodeWalk(child, fn, fnMap);
    }
    debugger;
    if ((fnMap != null ? fnMap[node.type] : void 0) != null) {
      fnMap[node.type](node);
    }
    if (fn != null) {
      return fn(node);
    }
  };

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

  fs.readFile('patterns/getterSetter.js', 'utf8', function(err, jsFile) {
    var ast, nodeFn;
    if (err) {
      return console.log(err);
    }
    ast = acorn.parse(jsFile);
    nodeFn = function(node) {
      return node.hash = computeHash(node);
    };
    nodeWalk(ast, nodeFn);
    debugger;
  });

}).call(this);
