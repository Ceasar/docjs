/*
# Utilities for working with the abstract syntax tree
*/


(function() {
  var TYPES, getChildren, getNodeSrc, getNodeTypes, isIIFE, nodeWalk, ty, type, typeTree, _, _i, _len,
    __hasProp = {}.hasOwnProperty;

  _ = require('lodash');

  TYPES = ["Node", "Program", "Function", "Statement", "EmptyStatement", "BlockStatement", "ExpressionStatement", "IfStatement", "LabeledStatement", "BreakStatement", "ContinueStatement", "WithStatement", "SwitchStatement", "ReturnStatement", "ThrowStatement", "TryStatement", "WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement", "LetStatement", "DebuggerStatement", "Declaration", "FunctionDeclaration", "VariableDeclaration", "VariableDeclarator", "Expression", "ThisExpression", "ArrayExpression", "ObjectExpression", "FunctionExpression", "ArrowExpression", "SequenceExpression", "UnaryExpression", "BinaryExpression", "AssignmentExpression", "UpdateExpression", "LogicalExpression", "ConditionalExpression", "NewExpression", "CallExpression", "MemberExpression", "YieldExpression", "ComprehensionExpression", "GeneratorExpression", "GraphExpression", "GraphIndexExpression", "LetExpression", "Pattern", "ObjectPattern", "ArrayPattern", "SwitchCase", "CatchClause", "ComprehensionBlock", "Identifier", "Literal"];

  typeTree = {
    Node: null,
    Program: 'Node',
    Function: 'Node',
    Statement: 'Node',
    EmptyStatement: 'Statement',
    BlockStatement: 'Statement',
    ExpressionStatement: 'Statement',
    IfStatement: 'Statement',
    LabeledStatement: 'Statement',
    BreakStatement: 'Statement',
    ContinueStatement: 'Statement',
    WithStatement: 'Statement',
    SwitchStatement: 'Statement',
    ReturnStatement: 'Statement',
    ThrowStatement: 'Statement',
    TryStatement: 'Statement',
    WhileStatement: 'Statement',
    DoWhileStatement: 'Statement',
    ForStatement: 'Statement',
    ForInStatement: 'Statement',
    ForOfStatement: 'Statement',
    LetStatement: 'Statement',
    DebuggerStatement: 'Statement',
    Declaration: 'Statement',
    FunctionDeclaration: ['Function', 'Declaration'],
    VariableDeclaration: 'Declaration',
    VariableDeclarator: 'Node',
    Expression: ['Node', 'Pattern'],
    ThisExpression: 'Expression',
    ArrayExpression: 'Expression',
    ObjectExpression: 'Expression',
    FunctionExpression: ['Function', 'Expression'],
    ArrowExpression: ['Function', 'Expression'],
    SequenceExpression: 'Expression',
    UnaryExpression: 'Expression',
    BinaryExpression: 'Expression',
    AssignmentExpression: 'Expression',
    UpdateExpression: 'Expression',
    LogicalExpression: 'Expression',
    ConditionalExpression: 'Expression',
    NewExpression: 'Expression',
    CallExpression: 'Expression',
    MemberExpression: 'Expression',
    YieldExpression: 'Expression',
    ComprehensionExpression: 'Expression',
    GeneratorExpression: 'Expression',
    GraphExpression: 'Expression',
    GraphIndexExpression: 'Expression',
    LetExpression: 'Expression',
    Pattern: 'Node',
    ObjectPattern: 'Pattern',
    ArrayPattern: 'Pattern',
    SwitchCase: 'Pattern',
    CatchClause: 'Node',
    ComprehensionBlock: 'Node',
    Identifier: ['Node', 'Expression', 'Pattern'],
    Literal: ['Node', 'Expression']
  };

  ty = {};

  for (_i = 0, _len = TYPES.length; _i < _len; _i++) {
    type = TYPES[_i];
    ty['is' + type] = exports['is' + type] = (function(type) {
      return function(node) {
        return (node != null ? node.type : void 0) === type;
      };
    })(type);
  }

  getChildren = function(node) {
    var childNode, children, h, k, prop, v, _j, _k, _l, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3;
    children = [];
    for (k in node) {
      if (!__hasProp.call(node, k)) continue;
      v = node[k];
      if ((v != null ? v.type : void 0) != null) {
        children.push(v);
      } else if (Array.isArray(v) && v.length) {
        for (_j = 0, _len1 = v.length; _j < _len1; _j++) {
          childNode = v[_j];
          if (childNode.type != null) {
            children.push(childNode);
          }
        }
      }
    }
    if ((_ref = node.type) === 'LetStatement' || _ref === 'LetExpression') {
      _ref1 = node.head;
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        h = _ref1[_k];
        children.push(h.id);
        if (h.init != null) {
          children.push(h.init);
        }
      }
    } else if ((_ref2 = node.type) === 'ObjectExpression' || _ref2 === 'ObjectPattern') {
      _ref3 = node.properties;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        prop = _ref3[_l];
        children.push(prop.key);
        children.push(prop.value);
      }
    }
    return children;
  };

  /*
  # A generic function to walk the AST
  #
  # @param node   An AST node
  # @param fn     Callback function, called on every child of the root node
  # @param fnMap  A map of AST types to functions called on each of those types
  # @param limit  How deep in the subtree to walk (default = whole tree)
  */


  nodeWalk = function(node, fn, fnMap, limit) {
    var child, _j, _k, _len1, _len2, _ref, _ref1;
    if (limit != null) {
      if (limit > 0) {
        _ref = getChildren(node);
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          child = _ref[_j];
          nodeWalk(child, fn, fnMap, limit - 1);
        }
      }
    } else {
      _ref1 = getChildren(node);
      for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
        child = _ref1[_k];
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
  # Given a node with location information and a source file, return the string
  # of source code corresponding to the node
  */


  getNodeSrc = function(node, src) {
    var end, lines, start, _ref;
    _ref = node.loc, start = _ref.start, end = _ref.end;
    lines = src.split('\n');
    return lines.slice(start.line - 1, end.line).join('\n');
  };

  isIIFE = function(node) {
    return exports.isCallExpression(node) && exports.isFunctionExpression(node.callee);
  };

  /*
  # Generate a node-type vector for a subtree, optionally limited to a depth
  # limit. A "hash" for a subtree of the AST is an object that keeps track of the
  # count of each node type present in the subtree.
  #
  # @param ast    (Object) an AST subtree
  # @param depth  (Number) optional argument that limits the depth of the traversal
  */


  getNodeTypes = function(ast, depth) {
    var combineHashes, computeHash, getNodeVector;
    combineHashes = function(hashes) {
      var combined, count, h, nodeType, _j, _len1;
      combined = {};
      for (_j = 0, _len1 = hashes.length; _j < _len1; _j++) {
        h = hashes[_j];
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
        var _j, _len1, _ref, _results;
        _ref = getChildren(node);
        _results = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          child = _ref[_j];
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

  _.extend(module.exports, {
    TYPES: TYPES,
    getChildren: getChildren,
    nodeWalk: nodeWalk,
    getNodeTypes: getNodeTypes,
    isIIFE: isIIFE,
    getNodeSrc: getNodeSrc
  });

}).call(this);
