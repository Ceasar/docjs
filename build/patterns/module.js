/*
# Identify the 'module' pattern given an AST.
*/


(function() {
  var CodePointer, Module, acorn, ast, findIdentifierLoc, fs, getModule, getModuleMembers, getName, iifes, moduleDir, modules, path, program, programs, q, srcs, _, _i, _len;

  _ = require('lodash');

  acorn = require('acorn');

  fs = require('fs');

  path = require('path');

  ast = require('../ast');

  q = require('../utils').q;

  getName = function(node) {
    if (ast.isIdentifier(node)) {
      return node.name;
    } else if (ast.isLiteral(node)) {
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
      if (ast.isFunctionDeclaration(stmt) && stmt.id.name === name) {
        return stmt.loc;
      }
      if (ast.isVariableDeclaration(stmt)) {
        _ref1 = stmt.declarations.slice().reverse();
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          _ref2 = _ref1[_j], id = _ref2.id, init = _ref2.init;
          if (ast.isIdentifier(id) && id.name === name) {
            return stmt.loc;
          }
          debugger;
        }
      }
    }
  };

  getModuleMembers = function(stmts, moduleName) {
    var left, module, name, right, stmt, _i, _len, _ref;
    module = new Module();
    for (_i = 0, _len = stmts.length; _i < _len; _i++) {
      stmt = stmts[_i];
      if (ast.isExpressionStatement(stmt) && ast.isAssignmentExpression(stmt.expression) && ast.isMemberExpression(stmt.expression.left) && moduleName === stmt.expression.left.object.name) {
        _ref = stmt.expression, left = _ref.left, right = _ref.right;
        name = getName(left.property);
        module.api.push(new CodePointer(name, right.loc));
      }
    }
    return module;
  };

  getModule = function(node) {
    var body, codePointer, key, kind, loc, module, name, returnExpr, value, _i, _len, _ref, _ref1, _ref2;
    if (!ast.isIIFE(node)) {
      return null;
    }
    body = node.callee.body.body;
    returnExpr = (_ref = _.find(body, ast.isReturnStatement)) != null ? _ref.argument : void 0;
    if (!returnExpr) {
      return null;
    }
    module = new Module();
    if (ast.isObjectExpression(returnExpr)) {
      _ref1 = returnExpr.properties;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        _ref2 = _ref1[_i], key = _ref2.key, value = _ref2.value, kind = _ref2.kind;
        name = getName(key);
        if (ast.isIdentifier(value)) {
          loc = findIdentifierLoc(body, value.name);
        } else {
          loc = value.loc;
        }
        codePointer = new CodePointer(name, loc);
        module.api.push(codePointer);
      }
      return module;
    } else if (ast.isIdentifier(returnExpr)) {
      return getModuleMembers(body, returnExpr.name);
    } else {
      return null;
    }
  };

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

  moduleDir = 'analysis/examples/modules';

  programs = fs.readdirSync(moduleDir).map(function(file) {
    var fileStr;
    file = path.join(moduleDir, file);
    fileStr = fs.readFileSync(file, 'utf8');
    return acorn.parse(fileStr, {
      locations: true,
      sourceFile: file
    });
  });

  iifes = [];

  srcs = [];

  modules = [];

  for (_i = 0, _len = programs.length; _i < _len; _i++) {
    program = programs[_i];
    ast.nodeWalk(program, function(node) {
      if (ast.isIIFE(node)) {
        iifes.push(node);
        modules.push(getModule(node));
        return srcs.push(ast.getNodeSrc(node, fs.readFileSync(node.loc.source, 'utf8')));
      }
    });
  }

}).call(this);
