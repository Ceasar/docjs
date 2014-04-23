(function() {
  var CodeCatalog, MVCPattern, RSVP, acorn, astUtils, findAngularDefinitions, findBackboneDefinitions, findEmberDefinitions, findMVCDefinitions, fs, nullFn, q, walk, _;

  fs = require('fs');

  _ = require('lodash');

  RSVP = require('rsvp');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  q = require('../utils').q;

  astUtils = require('../ast');

  CodeCatalog = require('../code-catalog').CodeCatalog;

  MVCPattern = require('../code-catalog').MVCPattern;

  nullFn = function() {
    return null;
  };

  findMVCDefinitions = function(ast) {
    var backboneDefs, emberDefs, mvc;
    mvc = new MVCPattern();
    backboneDefs = mvc.getCatalog('Backbone');
    findBackboneDefinitions(ast, backboneDefs);
    emberDefs = mvc.getCatalog('Ember');
    findEmberDefinitions(ast, emberDefs);
    return mvc;
  };

  findBackboneDefinitions = function(ast, backbone) {
    var collectionDefs, modelDefs, viewDefs;
    modelDefs = backbone.getCatalog('Models');
    viewDefs = backbone.getCatalog('Views');
    collectionDefs = backbone.getCatalog('Collections');
    astUtils.nodeWalk(ast, nullFn, {
      VariableDeclarator: function(node) {
        var callee, name, right, _ref;
        if ((right = node.init) && right.type === 'CallExpression') {
          name = node.id.name;
          if ((((_ref = right.callee.property) != null ? _ref.name : void 0) === 'extend') && (callee = right.callee.object) && callee.type === 'MemberExpression' && callee.object.name === 'Backbone' && callee.property.type === 'Identifier') {
            switch (callee.property.name) {
              case 'Model':
                return modelDefs.addPointer(name, right.loc);
              case 'View':
                return viewDefs.addPointer(name, right.loc);
              case 'Collection':
                return collectionDefs.addPointer(name, right.loc);
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
                return modelDefs.addPointer(name, right.loc);
              case 'View':
                return viewDefs.addPointer(name, right.loc);
              case 'Collection':
                return collectionDefs.addPointer(name, right.loc);
            }
          }
        }
      }
    });
    return backbone;
  };

  findEmberDefinitions = function(ast, ember) {
    var application, array_controllers, checkbox_views, controllers, models, object_controllers, router, select_views, textarea_views, textfield_views, view_views, views;
    application = ember.getCatalog('Application');
    router = ember.getCatalog('Router');
    controllers = ember.getCatalog('Controllers');
    array_controllers = controllers.getCatalog('Array Controllers');
    object_controllers = controllers.getCatalog('Object Controllers');
    models = ember.getCatalog('Models');
    views = ember.getCatalog('Views');
    checkbox_views = views.getCatalog('Checkbox');
    textfield_views = views.getCatalog('Textfield');
    select_views = views.getCatalog('Select');
    textarea_views = views.getCatalog('Textarea');
    view_views = views.getCatalog('View');
    astUtils.nodeWalk(ast, nullFn, {
      VariableDeclarator: function(node) {
        var controller_type, name, right, view_type, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        name = void 0;

        /*
         * Check for Ember.Application.create
         */
        if ((right = node.init) && right.type === 'CallExpression') {
          if ((right != null ? (_ref = right.callee) != null ? (_ref1 = _ref.object) != null ? (_ref2 = _ref1.object) != null ? _ref2.name : void 0 : void 0 : void 0 : void 0) === 'Ember' && (right != null ? (_ref3 = right.callee) != null ? (_ref4 = _ref3.object) != null ? (_ref5 = _ref4.property) != null ? _ref5.name : void 0 : void 0 : void 0 : void 0) === 'Application' && (right != null ? (_ref6 = right.callee) != null ? (_ref7 = _ref6.property) != null ? _ref7.name : void 0 : void 0 : void 0) === 'create') {
            name = node.id.name;
            application.addPointer(name, right.loc);
          }
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if ((right != null ? (_ref8 = right.callee) != null ? (_ref9 = _ref8.object) != null ? (_ref10 = _ref9.object) != null ? _ref10.name : void 0 : void 0 : void 0 : void 0) === 'Ember' && (controller_type = right != null ? (_ref11 = right.callee) != null ? (_ref12 = _ref11.object) != null ? _ref12.property.name : void 0 : void 0 : void 0) && (controller_type === 'ArrayController' || controller_type === 'ObjectController') && (right != null ? (_ref13 = right.callee) != null ? (_ref14 = _ref13.property) != null ? _ref14.name : void 0 : void 0 : void 0) === 'extend') {
          name = node.id.name;
          if (controller_type === 'ArrayController') {
            array_controllers.addPointer(name, node.right.loc);
          } else {
            object_controllers.addPointer(name, node.right.loc);
          }
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if ((right != null ? (_ref15 = right.callee) != null ? (_ref16 = _ref15.object) != null ? (_ref17 = _ref16.object) != null ? _ref17.name : void 0 : void 0 : void 0 : void 0) === 'DS' && ((right != null ? (_ref18 = right.callee) != null ? (_ref19 = _ref18.object) != null ? _ref19.property.name : void 0 : void 0 : void 0) === 'Model') && (right != null ? (_ref20 = right.callee) != null ? (_ref21 = _ref20.property) != null ? _ref21.name : void 0 : void 0 : void 0) === 'extend') {
          name = node.id.name;
          models.addPointer(name, right.loc);
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if ((right != null ? (_ref22 = right.callee) != null ? (_ref23 = _ref22.object) != null ? (_ref24 = _ref23.object) != null ? _ref24.name : void 0 : void 0 : void 0 : void 0) === 'Ember' && (view_type = right != null ? (_ref25 = right.callee) != null ? (_ref26 = _ref25.object) != null ? _ref26.property.name : void 0 : void 0 : void 0) && (view_type === 'Checkbox' || view_type === 'TextField' || view_type === "Select" || view_type === 'TextArea' || view_type === 'View')) {
          name = node.id.name;
          switch (view_type) {
            case 'Checkbox':
              return checkbox_views.addPointer(name, node.right.loc);
            case 'TextField':
              return textfield_views.addPointer(name, node.right.loc);
            case 'TextArea':
              return textarea_views.addPointer(name, node.right.loc);
            case 'Select':
              return select_views.addPointer(name, node.right.loc);
            case 'View':
              return view_views.addPointer(name, node.right.loc);
          }
        }
      },
      AssignmentExpression: function(node) {
        var controller_type, name, right, view_type, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        name = void 0;

        /*
         * Check for Ember.Application.create
         */
        if ((right = node.right) && right.type === 'CallExpression') {
          if (node.left.type === 'MemberExpression' && node.left.object.name === 'exports') {
            name = (_ref = node.left.property) != null ? _ref.name : void 0;
          }
          if ((right != null ? (_ref1 = right.callee) != null ? (_ref2 = _ref1.object) != null ? (_ref3 = _ref2.object) != null ? _ref3.name : void 0 : void 0 : void 0 : void 0) === 'Ember' && (right != null ? (_ref4 = right.callee) != null ? (_ref5 = _ref4.object) != null ? (_ref6 = _ref5.property) != null ? _ref6.name : void 0 : void 0 : void 0 : void 0) === 'Application' && (right != null ? (_ref7 = right.callee) != null ? (_ref8 = _ref7.property) != null ? _ref8.name : void 0 : void 0 : void 0) === 'create') {
            astUtils.nodeWalk(node.left, nullFn, {
              Identifier: function(node) {
                return name = node.name;
              }
            });
            application.addPointer(name, right.loc);
          }
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if ((right != null ? (_ref9 = right.callee) != null ? (_ref10 = _ref9.object) != null ? (_ref11 = _ref10.object) != null ? _ref11.name : void 0 : void 0 : void 0 : void 0) === 'Ember' && (controller_type = right != null ? (_ref12 = right.callee) != null ? (_ref13 = _ref12.object) != null ? _ref13.property.name : void 0 : void 0 : void 0) && (controller_type === 'ArrayController' || controller_type === 'ObjectController') && (right != null ? (_ref14 = right.callee) != null ? (_ref15 = _ref14.property) != null ? _ref15.name : void 0 : void 0 : void 0) === 'extend') {
          name = node.left;
          astUtils.nodeWalk(node.left, nullFn, {
            Identifier: function(node) {
              return name = node.name;
            }
          });
          if (controller_type === 'ArrayController') {
            array_controllers.addPointer(name, node.right.loc);
          } else {
            object_controllers.addPointer(name, node.right.loc);
          }
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if ((right != null ? (_ref16 = right.callee) != null ? (_ref17 = _ref16.object) != null ? (_ref18 = _ref17.object) != null ? _ref18.name : void 0 : void 0 : void 0 : void 0) === 'DS' && ((right != null ? (_ref19 = right.callee) != null ? (_ref20 = _ref19.object) != null ? _ref20.property.name : void 0 : void 0 : void 0) === 'Model') && ((_ref21 = node.right) != null ? (_ref22 = _ref21.callee) != null ? (_ref23 = _ref22.property) != null ? _ref23.name : void 0 : void 0 : void 0) === 'extend') {
          name = node.left;
          astUtils.nodeWalk(node.left, nullFn, {
            Identifier: function(node) {
              return name = node.name;
            }
          });
          models.addPointer(name, node.right.loc);
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if ((right != null ? (_ref24 = right.callee) != null ? (_ref25 = _ref24.object) != null ? (_ref26 = _ref25.object) != null ? _ref26.name : void 0 : void 0 : void 0 : void 0) === 'Ember' && (view_type = right != null ? (_ref27 = right.callee) != null ? (_ref28 = _ref27.object) != null ? _ref28.property.name : void 0 : void 0 : void 0) && (view_type === 'Checkbox' || view_type === 'TextField' || view_type === "Select" || view_type === 'TextArea' || view_type === 'View')) {
          astUtils.nodeWalk(node.left, nullFn, {
            Identifier: function(node) {
              return name = node.name;
            }
          });
          switch (view_type) {
            case 'Checkbox':
              return checkbox_views.addPointer(name, node.right.loc);
            case 'TextField':
              return textfield_views.addPointer(name, node.right.loc);
            case 'TextArea':
              return textarea_views.addPointer(name, node.right.loc);
            case 'Select':
              return select_views.addPointer(name, node.right.loc);
            case 'View':
              return view_views.addPointer(name, node.right.loc);
          }
        }
      },
      CallExpression: function(node) {
        var name, _ref, _ref1, _ref2, _ref3;
        name = void 0;
        if (((_ref = node.callee) != null ? (_ref1 = _ref.property) != null ? _ref1.name : void 0 : void 0) === 'map' && ((_ref2 = node.callee) != null ? (_ref3 = _ref2.object) != null ? _ref3.name : void 0 : void 0) === 'Router') {
          name = node.callee.object.name;
          return router.addPointer('name', node.loc);
        }
      }
    });
    return ember;
  };

  findAngularDefinitions = function(ast, angularDefs) {};

  module.exports = {
    findMVC: findMVCDefinitions
  };

}).call(this);
