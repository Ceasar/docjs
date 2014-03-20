/*
Attempting to identify module pattern
*/


(function() {
  var acorn, all, ast, asts, fs, iifes, isIIFE, moduleDir, nodeWalk, q, _i, _len;

  acorn = require('acorn');

  fs = require('fs');

  all = require('rsvp').all;

  nodeWalk = require('./ast').nodeWalk;

  q = require('./utils').q;

  isIIFE = function(node) {
    var _ref;
    return node.type === 'CallExpression' && ((_ref = node.callee) != null ? _ref.type : void 0) === 'FunctionExpression';
  };

  moduleDir = 'analysis/examples/modules';

  asts = fs.readdirSync(moduleDir).map(function(file) {
    return acorn.parse(fs.readFileSync(moduleDir + '/' + file, 'utf8'));
  });

  iifes = [];

  for (_i = 0, _len = asts.length; _i < _len; _i++) {
    ast = asts[_i];
    nodeWalk(ast, function(node) {
      if (isIIFE(node)) {
        return iifes.push(node);
      }
    });
  }

}).call(this);
