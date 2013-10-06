var fs      = require('fs')
  , _       = require('lodash')
  , esprima = require('esprima');

fs.readFile('examples/cucumber.js', 'utf8', function (err, jsFile) {
    if (err) return console.log(err);

    var ast = esprima.parse(jsFile)
      , stringifiedAST = JSON.stringify(ast, null, 4);

    var body = ast.body
      , classes = {};

    // Identify classes declared at the top level
    _(body).each(function (expr) {
        if (expr.type === esprima.Syntax.VariableDeclaration &&
              expr.declarations.length === 1) {

            // Scan for IIFE
            var decl = expr.declarations[0];
            if (decl.init.type === esprima.Syntax.CallExpression &&
                  decl.init.callee.type === esprima.Syntax.FunctionExpression &&
                  decl.init.callee.id === null &&
                  decl.init.callee.body.type === esprima.Syntax.BlockStatement) {
                classes[decl.id.name] = decl.init;
            }
        }
    });

    console.log(classes);
});
