(function() {
  var CodeCatalog, NODE_TYPES, RSVP, acorn, astUtils, findAngularDefinitions, findBackboneDefinitions, findEmberDefinitions, findMVCDefinitions, fs, nullFn, q, walk, _;

  fs = require('fs');

  _ = require('lodash');

  RSVP = require('rsvp');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  q = require('../utils').q;

  astUtils = require('../ast');

  CodeCatalog = require('../code-catalog').CodeCatalog;

  NODE_TYPES = require('../types').types;

  nullFn = function() {
    return null;
  };

  findMVCDefinitions = function(ast) {
    var angularDefs, backboneDefs, emberDefs, mvcDefinitions;
    backboneDefs = new CodeCatalog();
    findBackboneDefinitions(ast, backboneDefs);
    emberDefs = new CodeCatalog();
    findEmberDefinitions(ast, emberDefs);
    angularDefs = new CodeCatalog();
    findAngularDefinitions(ast, angularDefs);
    mvcDefinitions = new CodeCatalog();
    mvcDefinitions.add('backbone', backboneDefs.toJSON());
    mvcDefinitions.add('ember', emberDefs.toJSON());
    mvcDefinitions.add('angular', angularDefs.toJSON());
    console.log(mvcDefinitions.toJSON());
    return mvcDefinitions.toJSON();
  };

  findBackboneDefinitions = function(ast, backboneDefs) {
    var collectionDefs, modelDefs, viewDefs;
    modelDefs = new CodeCatalog();
    viewDefs = new CodeCatalog();
    collectionDefs = new CodeCatalog();
    astUtils.nodeWalk(ast, nullFn, {
      VariableDeclarator: function(node) {
        var callee, model, name, right, _ref;
        if ((right = node.init) && right.type === 'CallExpression') {
          name = node.id.name;
          if ((((_ref = right.callee.property) != null ? _ref.name : void 0) === 'extend') && (callee = right.callee.object) && callee.type === 'MemberExpression' && callee.object.name === 'Backbone' && callee.property.type === 'Identifier') {
            switch (callee.property.name) {
              case 'Model':
                model = new CodeCatalog();
                console.log('found a model!');
                return modelDefs.add(name, model);
              case 'View':
                console.log('found a view!');
                return viewDefs.add(name, right);
              case 'Collection':
                console.log('found a collection!');
                return collectionDefs.add(name, right);
            }
          }
        }
      },
      AssignmentExpression: function(node) {
        var callee, name, right, _ref;
        name = void 0;
        if ((right = node.right) && right.type === 'CallExpression') {
          astUtils.nodeWalk(node.left, nullFn, {
            Identifier: function(node) {
              return name = node.name;
            }
          });
          if ((((_ref = right.callee.property) != null ? _ref.name : void 0) === 'extend') && (callee = right.callee.object) && callee.type === 'MemberExpression' && callee.object.name === 'Backbone' && callee.property.type === 'Identifier') {
            switch (callee.property.name) {
              case 'Model':
                console.log('found a model!');
                return modelDefs.add(name, right);
              case 'View':
                console.log('found a view!');
                return viewDefs.add(name, right);
              case 'Collection':
                console.log('found a collection!');
                return collectionDefs.add(name, right);
            }
          }
        }
      }
    });
    backboneDefs.add('models', modelDefs.toJSON());
    backboneDefs.add('views', viewDefs.toJSON());
    backboneDefs.add('collections', collectionDefs.toJSON());
    return backboneDefs;
  };

  findEmberDefinitions = function(ast, emberComponents) {
    astUtils.nodeWalk(ast, nullFn, {
      VariableDeclarator: function(node) {
        var ember_temp, name, right, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
        console.log('variable declarator');
        name = void 0;

        /*
         * Check for Ember.Application.create
         */
        if ((right = node.init) && right.type === 'CallExpression') {
          if ((right != null ? (_ref = right.callee) != null ? (_ref1 = _ref.object) != null ? (_ref2 = _ref1.object) != null ? _ref2.name : void 0 : void 0 : void 0 : void 0) === 'Ember' && (right != null ? (_ref3 = right.callee) != null ? (_ref4 = _ref3.object) != null ? (_ref5 = _ref4.property) != null ? _ref5.name : void 0 : void 0 : void 0 : void 0) === 'Application' && (right != null ? (_ref6 = right.callee) != null ? (_ref7 = _ref6.property) != null ? _ref7.name : void 0 : void 0 : void 0) === 'create') {
            name = node.id.name;
            console.log(name);
            if (name != null) {
              if (emberComponents.has(name)) {
                return emberComponents.add('Application', right);
              } else {
                ember_temp = new CodeCatalog();
                ember_temp.add('Application', right);
                return emberComponents.add(name, ember_temp.toJSON());
              }
            }
          }
        }
      },
      AssignmentExpression: function(node) {
        var ember_temp, name, right, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
        console.log('assignment expression');
        name = void 0;

        /*
         * Check for Ember.Application.create
         */
        if ((right = node.right) && right.type === 'CallExpression') {
          if (node.left.type === 'MemberExpression' && node.left.object.name === 'exports') {
            name = node.left.property.name;
          } else if (node.left.type === 'hi') {
            console.log('hi');
          }
          if ((right != null ? (_ref = right.callee) != null ? (_ref1 = _ref.object) != null ? (_ref2 = _ref1.object) != null ? _ref2.name : void 0 : void 0 : void 0 : void 0) === 'Ember' && (right != null ? (_ref3 = right.callee) != null ? (_ref4 = _ref3.object) != null ? (_ref5 = _ref4.property) != null ? _ref5.name : void 0 : void 0 : void 0 : void 0) === 'Application' && (right != null ? (_ref6 = right.callee) != null ? (_ref7 = _ref6.property) != null ? _ref7.name : void 0 : void 0 : void 0) === 'create') {
            astUtils.nodeWalk(node.left, nullFn, {
              Identifier: function(node) {
                return name = node.name;
              }
            });
            console.log(name);
            if (name != null) {
              if (emberComponents.has(name)) {
                return emberComponents.add('Application', right);
              } else {
                ember_temp = new CodeCatalog();
                ember_temp.add('Application', right);
                return emberComponents.add(name, ember_temp.toJSON());
              }
            }
          }
        }
      },
      MemberExpression: function(node) {
        return console.log('member expression');
      },
      CallExpression: function(node) {
        var name;
        name = void 0;
        if (node.property.name === 'map' && node.callee.property.name === 'Router') {
          name = node.callee.object.name;
          return emberComponents.add('Router', node);
        }
      }
    });
    return emberComponents;
  };

  findAngularDefinitions = function(ast, angularDefs) {};

  module.exports = {
    findMVC: findMVCDefinitions
  };

}).call(this);
