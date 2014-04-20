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
  var acorn, convertForToWhile, convertSwitchToIf, fs, rebuildAST, walk, _;

  fs = require('fs');

  _ = require('lodash');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  /*
  #
  # Input AST:
  # for(var i=0; i < 10; i++)
  #   sum++;
  #
  # Output AST:
  # var i=0;
  # while(i < 10) {
  #   sum++;
  #   i++;
  # }
  #
  #
  #
  */


  convertSwitchToIf = function(node, index, obj) {
    var i, if_node, last_if, parent_if, switchCase, _i, _len, _ref, _results;
    parent_if = last_if = {};
    _ref = node.cases;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      switchCase = _ref[i];
      if (if_node.test.right !== 'default') {
        if_node = {
          type: 'IfStatement',
          start: switchCase.start,
          end: switchCase.end,
          test: {
            type: 'BinaryExpression',
            start: 0,
            end: 0,
            left: node.discriminant,
            operator: '===',
            right: switchCase.test,
            consequent: switchCase.consequent
          }
        };
      } else {
        if_node = {
          type: 'BlockStatement',
          start: switchCase.start,
          end: switchCase.end,
          body: consequent
        };
      }
      if (i === 0) {
        parent_if = if_node;
      } else {
        parent_if.alternate = if_node;
      }
      _results.push(last_if = if_node);
    }
    return _results;
  };

  convertForToWhile = function(node, index, obj) {
    var while_node;
    while_node = {
      type: "WhileStatement",
      start: node.start,
      end: node.end,
      test: test,
      body: body
    };
    while_node.body.body.push(node.update);
    return obj.body.slice(index, 0, node.init);
  };

  rebuildAST = function(stringifiedAST) {
    var index, node, obj, _i, _len, _ref, _results;
    obj = JSON.parse(stringifiedAST);
    _ref = obj.body;
    _results = [];
    for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
      node = _ref[index];
      if (node.type === 'ForStatement') {
        convertForToWhile(node, index, obj);
      }
      if (node.type === 'SwitchStatement') {
        _results.push(convertSwitchToIf(node, index, obj));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  fs.readFile('examples/subset/switch.js', 'utf8', function(err, jsFile) {
    var ast, body, collected, k, registerNode, stringifiedAST, v, visitors;
    if (err) {
      return console.log(err);
    }
    ast = acorn.parse(jsFile);
    stringifiedAST = JSON.stringify(ast, null, 4);
    fs.writeFile('examples/subset/out/out.js', stringifiedAST, function(err) {
      if (err) {
        throw err;
      } else {
        return console.log('Saved!');
      }
    });
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
    return console.log(visitors);
  });

}).call(this);
