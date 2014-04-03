(function() {
  var getChildren, getNodeTypes, nodeWalk, nodeWalkSingleLevel, _,
    __hasProp = {}.hasOwnProperty;

  _ = require('lodash');


  /*
   *
   * Utilities for working with the abstract syntax tree
   *
   */

  getChildren = function(node) {
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
  };


  /*
   * A generic function to walk the AST
   *
   * @param node   An AST node
   * @param fn     Callback function, called on every child of the root node
   * @param fnMap  A map of AST types to functions called on each of those types
   * @param limit  How deep in the subtree to walk (default = whole tree)
   */

  nodeWalk = function(node, fn, fnMap, limit) {
    var child, _i, _j, _len, _len1, _ref, _ref1;
    if (limit != null) {
      if (limit > 0) {
        _ref = getChildren(node);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          nodeWalk(child, fn, fnMap, limit - 1);
        }
      }
    } else {
      _ref1 = getChildren(node);
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        child = _ref1[_j];
        nodeWalk(child, fn, fnMap);
      }
    }
    if ((fnMap != null ? fnMap[node.type] : void 0) != null) {
      fnMap[node.type](node);
    }
    if (fn != null) {
      return fn(node);
    }
  };


  /*
   * A generic function to walk a single level of the AST
   *
   * @param node   An AST node
   * @param fn     Callback function, called on every child of the root node
   * @param fnMap  A map of AST types to functions called on each of those types
   * @param limit  How deep in the subtree to walk (default = whole tree)
   */

  nodeWalkSingleLevel = function(node, fn, fnMap, limit) {
    var child, _i, _len, _ref, _results;
    console.log(node);
    _ref = getChildren(node);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      if ((fnMap != null ? fnMap[node.type] : void 0) != null) {
        fnMap[node.type](node);
      }
      if (fn != null) {
        _results.push(fn(node));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };


  /*
   * Generate a node-type vector for a subtree, optionally limited to a depth
   * limit. A "hash" for a subtree of the AST is an object that keeps track of the
   * count of each node type present in the subtree.
   *
   * @param ast    (Object) an AST subtree
   * @param depth  (Number) optional argument that limits the depth of the traversal
   */

  getNodeTypes = function(ast, depth) {
    var combineHashes, computeHash, getNodeVector;
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
        _ref = getChildren(node);
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
    getNodeVector = function(node) {
      return node.hash = computeHash(node);
    };
    nodeWalk(ast, getNodeVector, null, depth);
    return ast;
  };

  module.exports = {
    getChildren: getChildren,
    nodeWalk: nodeWalk,
    nodeWalkSingleLevel: nodeWalkSingleLevel,
    getNodeTypes: getNodeTypes
  };

}).call(this);
