/*
Attempting to identify module pattern
*/


(function() {
  var CodePointer, Module, acorn, ast, fs, getModule, iifes, isIIFE, moduleDir, path, program, programs, q, srcs, _, _i, _len;

  _ = require('lodash');

  acorn = require('acorn');

  fs = require('fs');

  path = require('path');

  ast = require('./ast');

  q = require('./utils').q;

  isIIFE = function(node) {
    return ast.isCallExpression(node) && ast.isFunctionExpression(ast.callee);
  };

  getModule = function(node) {
    var body, returnExpr, _ref;
    if (!isIIFE(node)) {
      return null;
    }
    body = node.callee.body;
    returnExpr = (_ref = _.find(body, ast.isReturnStatement)) != null ? _ref.argument : void 0;
    if (!returnExpr) {
      return null;
    }
  };

  CodePointer = (function() {
    function CodePointer(_arg) {
      this.name = _arg.name, this.line = _arg.line;
    }

    return CodePointer;

  })();

  Module = (function() {
    function Module(_arg) {
      this.name = _arg.name, this.api = _arg.api;
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

  for (_i = 0, _len = programs.length; _i < _len; _i++) {
    program = programs[_i];
    ast.nodeWalk(program, function(node) {
      if (isIIFE(node)) {
        iifes.push(node);
        return srcs.push(ast.getNodeSrc(node, fs.readFileSync(node.loc.source, 'utf8')));
      }
    });
  }

  debugger;

}).call(this);
