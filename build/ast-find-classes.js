(function() {
  var CodeCatalog, FUNCTION_EXPRESSION_TYPE, Model, NODE_TYPES, RSVP, THIS_EXPRESSION_TYPE, acorn, astUtils, capitalizedVars, classDefinitions, findClassDefinitions, fs, q, walk, _,
    __hasProp = {}.hasOwnProperty;

  fs = require('fs');

  _ = require('lodash');

  RSVP = require('rsvp');

  Model = require('fishbone');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  q = require('./utils').q;

  astUtils = require('./ast');

  NODE_TYPES = require('./types').types;

  THIS_EXPRESSION_TYPE = 'ThisExpression';

  FUNCTION_EXPRESSION_TYPE = 'FunctionExpression';

  /*
  # Adds events to simple JS objects.
  # Prevents overwriting of entries (unless you remove that name first).
  */


  CodeCatalog = Model({
    init: function(entries) {
      var k, v, _results;
      _results = [];
      for (k in entries) {
        if (!__hasProp.call(entries, k)) continue;
        v = entries[k];
        _results.push(this[k] = v);
      }
      return _results;
    },
    add: function(name, pointer) {
      if (this.has(name)) {
        return false;
      }
      this.trigger('add', {
        name: name,
        pointer: pointer
      });
      this[name] = pointer;
      return true;
    },
    remove: function(name) {
      if (!this.has(name)) {
        return false;
      }
      this.trigger('remove', {
        name: name
      });
      delete this[name];
      return true;
    },
    has: function(name) {
      return this[name] != null;
    },
    get: function(name) {
      return this[name];
    },
    toJSON: function() {
      return _.omit(this, _.isFunction);
    }
  });

  classDefinitions = new CodeCatalog();

  capitalizedVars = new CodeCatalog();

  findClassDefinitions = function(ast) {
    var SEARCH_DEPTH, nodeTypeVector, nullFn, simpleClassDefinitionHelper;
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
    astUtils.nodeWalk(ast, nullFn, {
      AssignmentExpression: function(node) {
        var klass;
        if (node.left.type === 'MemberExpression') {
          klass = node.left.property.name;
          if (klass.isCapitalized()) {
            return capitalizedVars.add(klass, node.right);
          }
        } else if (node.left.type === 'Identifier') {
          klass = node.left.name;
          if (klass.isCapitalized()) {
            return capitalizedVars.add(klass, node.right);
          }
        }
      },
      VariableDeclarator: function(node) {
        var klass;
        klass = node.id.name;
        if ((node.init != null) && klass.isCapitalized()) {
          return capitalizedVars.add(klass, node.init);
        }
      },
      FunctionDeclaration: function(node) {
        var klass, _ref;
        klass = (_ref = node.id) != null ? _ref.name : void 0;
        if ((klass != null) && klass.isCapitalized()) {
          return capitalizedVars.add(klass, node);
        }
      }
    }, SEARCH_DEPTH);
    simpleClassDefinitionHelper = function(node, klass) {
      if (!capitalizedVars.has(klass)) {
        return;
      }
      return astUtils.nodeWalk(node, nullFn, {
        MemberExpression: function(node) {
          if (node.object.type === THIS_EXPRESSION_TYPE) {
            return classDefinitions.add(klass, capitalizedVars.get(klass));
          }
        }
      });
    };
    astUtils.nodeWalk(ast, nullFn, {
      MemberExpression: function(node) {
        var klass;
        klass = node.object.name;
        if (node.property.name === 'prototype' && capitalizedVars.has(klass)) {
          return classDefinitions.add(klass, capitalizedVars.get(klass));
        }
      },
      FunctionDeclaration: function(node) {
        var klass, _ref;
        if ((klass = (_ref = node.id) != null ? _ref.name : void 0) != null) {
          return simpleClassDefinitionHelper(node, klass);
        }
      },
      AssignmentExpression: function(node) {
        var klass;
        if (node.left.type === 'MemberExpression') {
          klass = node.left.property.name;
          if (node.right.type === FUNCTION_EXPRESSION_TYPE) {
            return simpleClassDefinitionHelper(node, klass);
          }
        } else if (node.left.type === 'Identifier') {
          klass = node.left.name;
          if (node.right.type === FUNCTION_EXPRESSION_TYPE) {
            return simpleClassDefinitionHelper(node, klass);
          }
        }
      },
      VariableDeclarator: function(node) {
        var klass, _ref;
        klass = node.id.name;
        if ((klass != null) && ((_ref = node.init) != null ? _ref.type : void 0) === FUNCTION_EXPRESSION_TYPE) {
          return simpleClassDefinitionHelper(node, klass);
        }
      }
    }, SEARCH_DEPTH);
    return classDefinitions.toJSON();
  };

  exports.getClassDefinitionsPromise = function(targetFile) {
    return q(fs.readFile, targetFile, 'utf8').then(_.partialRight(acorn.parse, {
      locations: true
    })).then(findClassDefinitions)["catch"](console.error);
  };

}).call(this);
