(function() {
  var acorn, fs, walk, _;

  fs = require('fs');

  _ = require('lodash');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  fs.readFile('examples/cucumber.js', 'utf8', function(err, jsFile) {
    var ast, body, collected, k, registerNode, stringifiedAST, v, visitors;
    if (err) {
      return console.log(err);
    }
    ast = acorn.parse(jsFile);
    stringifiedAST = JSON.stringify(ast, null, 4);
    body = ast.body;
    collected = {
      ExpressionStatement: [],
      IfStatement: [],
      WhileStatement: [],
      ForStatement: [],
      VariableDeclaration: [],
      FunctionDeclaration: [],
      ObjectExpression: [],
      FunctionExpression: [],
      NewExpression: []
    };
    registerNode = function(type) {
      return function(node, state) {
        return collected[type].push(node);
      };
    };
    visitors = {
      Node: function(node, state) {
        return null;
      },
      Program: function(node, state) {
        return null;
      },
      Statement: function(node, state) {
        return null;
      },
      Expression: function(node, state) {
        return null;
      }
    };
    for (k in collected) {
      v = collected[k];
      visitors[k] = registerNode(k);
    }
    console.log(visitors);
    walk.simple(body, visitors);
    return console.log(collected);
  });

}).call(this);
