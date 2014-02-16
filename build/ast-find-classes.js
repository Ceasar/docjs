(function() {
  var esprima, fs, _;

  fs = require('fs');

  _ = require('lodash');

  esprima = require('esprima');

  fs.readFile('analysis/targets/cucumber.js', 'utf8', function(err, jsFile) {
    var ast, body, classes, decl, expr, stringifiedAST, _i, _len;
    if (err) {
      return console.log(err);
    }
    ast = esprima.parse(jsFile);
    stringifiedAST = JSON.stringify(ast, null, 4);
    body = ast.body;
    classes = {};
    for (_i = 0, _len = body.length; _i < _len; _i++) {
      expr = body[_i];
      if (expr.type === esprima.Syntax.VariableDeclaration && expr.declarations.length === 1) {
        decl = expr.declarations[0];
        if (decl.init.type === esprima.Syntax.CallExpression && decl.init.callee.type === esprima.Syntax.FunctionExpression && decl.init.callee.id === null && decl.init.callee.body.type === esprima.Syntax.BlockStatement) {
          classes[decl.id.name] = decl.init;
        }
      }
    }
    return console.log(classes);
  });

}).call(this);
