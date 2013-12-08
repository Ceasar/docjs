/*
#
# Simplify the given AST to a subset of javascript.
#
# List of Nodes:
# - Program
# - Function
#
# - Statements
# -- Empty - keep
# -- Block - keep
# -- Expression - keep
# -- If - keep
# -- Labeled - not entirely sure what this is
# -- Break - keep
# -- Continue - keep
# -- With - how to REPLACE?
# -- Switch - REPLACE with if/else
# -- Return - keep
# -- Throw - keep
# -- Try - keep
# -- While - REPLACE with for
# -- do/while - REPLACE with for
# -- for- keep
# -- for/in - REPLACE with for?
# -- for/of - ignore? what is this..
# -- debugger - ignore
#
# - Declarations
# -- Function - keep
# -- Variable - keep
#
# - Expressions
# -- This - keep
# -- Array
# -- Object
# -- Function
# -- Arrow (fat arrow) (mozilla)
# -- Sequence (commas)
# -- Unary (unary operator)
# -- binary operator
# -- assignment operator
# -- update (increment/decremenet)
# -- logical operator
# -- conditional (ternary)
# -- new
# -- function/method call
# -- member ****
#
# - Patterns (ignore, only in js 1.7)
#
# - Clauses
# -- Swich case
# -- catch + try
# -- comprehension
#
# - Miscellaneous
# -- identifier
# -- literal
# -- unary operator
# -- binary operator
# -- logical operator
# -- assignment operator
# -- update operator
#
# - E4X (ignore)
# - XML (ignore)
#
#
*/


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
    console.log(stringifiedAST);
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
