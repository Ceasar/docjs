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
    findEmberDefinitions(ast, angularDefs);
    mvcDefinitions = new CodeCatalog();
    mvcDefinitions.add('backbone', backboneDefs.toJSON());
    mvcDefinitions.add('ember', emberDefs.toJSON());
    return mvcDefinitions.add('angular', angularDefs.toJSON());
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
          if (node.left.type === 'MemberExpression' && node.left.object.name === 'exports') {
            name = node.left.property.name;
          } else if (node.left.type === 'hi') {
            console.log('hi');
          }
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

  findEmberDefinitions = function(ast, emberDefs) {};

  findAngularDefinitions = function(ast, angularDefs) {};

  module.exports = {
    findMVC: findMVCDefinitions
  };

}).call(this);
