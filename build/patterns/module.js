/*
# Identify the 'module' pattern
*/


(function() {
  var CodePointer, Module, acorn, astUtils, findIdentifierLoc, findModuleDefinitions, fs, getModule, getModuleMembers, getName, path, q, _;

  _ = require('lodash');

  acorn = require('acorn');

  fs = require('fs');

  path = require('path');

  astUtils = require('../ast');

  q = require('../utils').q;

  CodePointer = (function() {
    function CodePointer(name, loc) {
      this.name = name;
      this.start = loc.start.line;
    }

    return CodePointer;

  })();

  Module = (function() {
    function Module(name, api) {
      this.name = name;
      this.api = api != null ? api : [];
    }

    return Module;

  })();

  getName = function(node) {
    if (astUtils.isIdentifier(node)) {
      return node.name;
    } else if (astUtils.isLiteral(node)) {
      return node.value;
    } else {
      throw new Error("Node " + node.type + " is not a Literal or Identifier");
    }
  };

  findIdentifierLoc = function(stmts, name) {
    var id, init, stmt, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    _ref = stmts.slice().reverse();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      stmt = _ref[_i];
      if (astUtils.isFunctionDeclaration(stmt) && stmt.id.name === name) {
        return stmt.loc;
      }
      if (astUtils.isVariableDeclaration(stmt)) {
        _ref1 = stmt.declarations.slice().reverse();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          _ref2 = _ref1[_j], id = _ref2.id, init = _ref2.init;
          if (astUtils.isIdentifier(id) && id.name === name) {
            return stmt.loc;
          }
          debugger;
        }
      }
    }
  };

  /*
  # TODO: documentation
  */


  getModuleMembers = function(stmts, moduleName) {
    var left, module, name, right, stmt, _i, _len, _ref;
    module = new Module();
    for (_i = 0, _len = stmts.length; _i < _len; _i++) {
      stmt = stmts[_i];
      if (astUtils.isExpressionStatement(stmt) && astUtils.isAssignmentExpression(stmt.expression) && astUtils.isMemberExpression(stmt.expression.left) && moduleName === stmt.expression.left.object.name) {
        _ref = stmt.expression, left = _ref.left, right = _ref.right;
        name = getName(left.property);
        module.api.push(new CodePointer(name, right.loc));
      }
    }
    return module;
  };

  getModule = function(node) {
    var body, codePointer, key, kind, loc, module, name, returnExpr, value, _i, _len, _ref, _ref1, _ref2;
    if (!astUtils.isIIFE(node)) {
      return null;
    }
    body = node.callee.body.body;
    returnExpr = (_ref = _.find(body, astUtils.isReturnStatement)) != null ? _ref.argument : void 0;
    if (!returnExpr) {
      return null;
    }
    module = new Module();
    if (astUtils.isObjectExpression(returnExpr)) {
      _ref1 = returnExpr.properties;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _ref2 = _ref1[_i], key = _ref2.key, value = _ref2.value, kind = _ref2.kind;
        name = getName(key);
        if (astUtils.isIdentifier(value)) {
          loc = findIdentifierLoc(body, value.name);
        } else {
          loc = value.loc;
        }
        codePointer = new CodePointer(name, loc);
        module.api.push(codePointer);
      }
      return module;
    } else if (astUtils.isIdentifier(returnExpr)) {
      return getModuleMembers(body, returnExpr.name);
    } else {
      return null;
    }
  };

  findModuleDefinitions = function(ast) {
    var docs;
    docs = {
      iifes: [],
      srcs: [],
      modules: []
    };
    astUtils.nodeWalk(ast, function(node) {
      var source;
      if (astUtils.isIIFE(node)) {
        docs.iifes.push(node);
        docs.modules.push(getModule(node));
        source = fs.readFileSync(node.loc.source, 'utf8');
        return docs.srcs.push(astUtils.getNodeSrc(node, source));
      }
    });
    if (_.every([docs.iifes, docs.srcs, docs.modules], _.isEmpty)) {
      return null;
    } else {
      return docs;
    }
  };

  module.exports = {
    findModules: findModuleDefinitions
  };

}).call(this);
