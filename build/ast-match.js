(function() {
  var acorn, fs, _;

  fs = require('fs');

  _ = require('lodash');

  acorn = require('acorn');

  fs.readFile('examples/cucumber.js', 'utf8', function(err, jsFile) {
    var ast, body, expr, stringifiedAST, _i, _len, _results;
    if (err) {
      return console.log(err);
    }
    ast = acorn.parse(jsFile);
    stringifiedAST = JSON.stringify(ast, null, 4);
    body = ast.body;
    _results = [];
    for (_i = 0, _len = body.length; _i < _len; _i++) {
      expr = body[_i];
      _results.push(console.log(expr));
    }
    return _results;
  });

}).call(this);
