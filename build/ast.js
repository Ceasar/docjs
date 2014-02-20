(function() {
  var TYPES, nodeWalk,
    __hasProp = {}.hasOwnProperty;

  ({
    /*
    Utilities for working with the abstract syntax tree
    */

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
  });

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

  TYPES = ["Node", "Program", "Function", "Statement", "EmptyStatement", "BlockStatement", "ExpressionStatement", "IfStatement", "LabeledStatement", "BreakStatement", "ContinueStatement", "WithStatement", "SwitchStatement", "ReturnStatement", "ThrowStatement", "TryStatement", "WhileStatement", "DoWhileStatement", "ForStatement", "ForInStatement", "ForOfStatement", "LetStatement", "DebuggerStatement", "Declaration", "FunctionDeclaration", "VariableDeclaration", "VariableDeclarator", "Expression", "ThisExpression", "ArrayExpression", "ObjectExpression", "FunctionExpression", "ArrowExpression", "SequenceExpression", "UnaryExpression", "BinaryExpression", "AssignmentExpression", "UpdateExpression", "LogicalExpression", "ConditionalExpression", "NewExpression", "CallExpression", "MemberExpression", "MemberExpression", "ComprehensionExpression", "GeneratorExpression", "GraphExpression", "GraphIndexExpression", "LetExpression", "Pattern", "ObjectPattern", "ArrayPattern", "SwitchCase", "CatchClause", "ComprehensionBlock", "Identifier", "Literal"];

  module.exports = {
    TYPES: TYPES,
    getChildren: getChildren,
    nodeWalk: nodeWalk
  };

}).call(this);
