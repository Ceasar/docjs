(function() {
  var NODE_TYPES, RSVP, acorn, astUtils, findClassDefinitions, fs, q, walk, _;

  fs = require('fs');

  _ = require('lodash');

  RSVP = require('rsvp');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  q = require('./utils').q;

  astUtils = require('./ast');

  NODE_TYPES = require('./types').types;

  findClassDefinitions = function(ast) {
    var SEARCH_DEPTH, capitalizedVars, classDefinitions, nodeTypeVector, nullFn;
    classDefinitions = {};
    nodeTypeVector = astUtils.getNodeTypes(ast);
    /*
    # TODO
    #
    # * match on CoffeeScript's class syntax
    */

    nullFn = function() {
      return null;
    };
    SEARCH_DEPTH = 10;
    String.prototype.isCapitalized = function() {
      return this.charAt(0).toUpperCase() === this.charAt(0);
    };
    capitalizedVars = {};
    astUtils.nodeWalk(ast, nullFn, {
      AssignmentExpression: function(node) {
        var klass;
        if (node.left.type === 'MemberExpression') {
          klass = node.left.property.name;
          if (klass.isCapitalized()) {
            return capitalizedVars[klass] = node.right;
          }
        } else if (node.left.type === 'Identifier') {
          klass = node.left.name;
          if (klass.isCapitalized()) {
            return capitalizedVars[klass] = node.right;
          }
        }
      },
      VariableDeclarator: function(node) {
        var klass;
        klass = node.id.name;
        if ((node.init != null) && klass.isCapitalized()) {
          return capitalizedVars[klass] = node.init;
        }
      },
      FunctionDeclaration: function(node) {
        var klass, _ref;
        klass = (_ref = node.id) != null ? _ref.name : void 0;
        if ((klass != null) && klass.isCapitalized()) {
          return capitalizedVars[klass] = node;
        }
      }
    }, SEARCH_DEPTH);
    astUtils.nodeWalk(ast, nullFn, {
      MemberExpression: function(node) {
        var klass;
        if (node.property.name === 'prototype') {
          klass = node.object.name;
          if (classDefinitions[klass] == null) {
            return classDefinitions[klass] = capitalizedVars[klass];
          }
        }
      }
    }, SEARCH_DEPTH);
    return classDefinitions;
  };

  q(fs.readFile, 'analysis/targets/classes.js', 'utf8').then(acorn.parse).then(findClassDefinitions).then(console.log)["catch"](console.error);

}).call(this);
