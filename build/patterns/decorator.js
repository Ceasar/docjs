/*

Finds the decorators in a Javascript program.
*/


(function() {
  var CodeCatalog, acorn, findDecorators, fs, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ = require('lodash');

  fs = require('fs');

  acorn = require('acorn');

  CodeCatalog = require('../code-catalog').CodeCatalog;

  findDecorators = function(ast) {
    var decorators, expression, name, node, _i, _len, _ref;
    decorators = new CodeCatalog();
    _ref = ast.body;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      node = _ref[_i];
      if (node.expression != null) {
        expression = node.expression;
        if (expression.left != null) {
          name = expression.left.name;
          if (expression.right["arguments"] != null) {
            if (__indexOf.call(_.pluck(expression.right["arguments"], 'name'), name) >= 0) {
              decorators.add(name, expression);
            }
          }
        }
      }
    }
    return decorators.toJSON();
  };

  module.exports = {
    findDecorators: findDecorators
  };

}).call(this);
