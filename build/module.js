/*
Attempting to identify module pattern
*/


(function() {
  var acorn, ast, asts, fs, getNodeSrc, iifes, isIIFE, moduleDir, nodeWalk, path, q, srcs, _i, _len, _ref;

  acorn = require('acorn');

  fs = require('fs');

  path = require('path');

  _ref = require('./ast'), nodeWalk = _ref.nodeWalk, getNodeSrc = _ref.getNodeSrc;

  q = require('./utils').q;

  isIIFE = function(node) {
    var _ref1;
    return node.type === 'CallExpression' && ((_ref1 = node.callee) != null ? _ref1.type : void 0) === 'FunctionExpression';
  };

  moduleDir = 'analysis/examples/modules';

  asts = fs.readdirSync(moduleDir).map(function(file) {
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

  for (_i = 0, _len = asts.length; _i < _len; _i++) {
    ast = asts[_i];
    nodeWalk(ast, function(node) {
      if (isIIFE(node)) {
        iifes.push(node);
        return srcs.push(getNodeSrc(node, fs.readFileSync(node.loc.source, 'utf8')));
      }
    });
  }

  debugger;

}).call(this);
