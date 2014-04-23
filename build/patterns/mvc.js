(function() {
  var CodeCatalog, RSVP, acorn, astUtils, findAngularDefinitions, findBackboneDefinitions, findEmberDefinitions, findMVCDefinitions, fs, nullFn, q, walk, _;

  fs = require('fs');

  _ = require('lodash');

  RSVP = require('rsvp');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  q = require('../utils').q;

  astUtils = require('../ast');

  CodeCatalog = require('../code-catalog').CodeCatalog;

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
    var array_controllers, checkbox_views, controllers, models, object_controllers, select_views, textarea_views, textfield_views, view_views, views;
    controllers = new CodeCatalog();
    array_controllers = new CodeCatalog();
    object_controllers = new CodeCatalog();
    models = new CodeCatalog();
    views = new CodeCatalog();
    checkbox_views = new CodeCatalog();
    textfield_views = new CodeCatalog();
    select_views = new CodeCatalog();
    textarea_views = new CodeCatalog();
    view_views = new CodeCatalog();
    astUtils.nodeWalk(ast, nullFn, {
      VariableDeclarator: function(node) {
        var controller_type, ember_temp, name, right, view_type, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
        name = void 0;

        /*
         * Check for Ember.Application.create
         */
        if ((right = node.init) && right.type === 'CallExpression') {
          if ((right != null ? (_ref = right.callee) != null ? (_ref1 = _ref.object) != null ? (_ref2 = _ref1.object) != null ? _ref2.name : void 0 : void 0 : void 0 : void 0) === 'Ember' && (right != null ? (_ref3 = right.callee) != null ? (_ref4 = _ref3.object) != null ? (_ref5 = _ref4.property) != null ? _ref5.name : void 0 : void 0 : void 0 : void 0) === 'Application' && (right != null ? (_ref6 = right.callee) != null ? (_ref7 = _ref6.property) != null ? _ref7.name : void 0 : void 0 : void 0) === 'create') {
            name = node.id.name;
            if (name != null) {
              if (emberComponents.has(name)) {
                emberComponents.add('Application', right);
              } else {
                ember_temp = new CodeCatalog();
                ember_temp.add('Application', right);
                emberComponents.add(name, ember_temp.toJSON());
              }
            }
          }
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if (((_ref8 = right.callee) != null ? (_ref9 = _ref8.object) != null ? (_ref10 = _ref9.object) != null ? _ref10.name : void 0 : void 0 : void 0) === 'Ember' && (controller_type = (_ref11 = right.callee) != null ? (_ref12 = _ref11.object) != null ? _ref12.property.name : void 0 : void 0) && (controller_type === 'ArrayController' || controller_type === 'ObjectController') && (right != null ? (_ref13 = right.callee) != null ? (_ref14 = _ref13.property) != null ? _ref14.name : void 0 : void 0 : void 0) === 'extend') {
          name = node.id.name;
          if (controller_type === 'ArrayController') {
            array_controllers.add(name, node.right);
          } else {
            object_controllers.add(name, node.right);
          }
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if (((_ref15 = right.callee) != null ? (_ref16 = _ref15.object) != null ? (_ref17 = _ref16.object) != null ? _ref17.name : void 0 : void 0 : void 0) === 'DS' && (((_ref18 = right.callee) != null ? (_ref19 = _ref18.object) != null ? _ref19.property.name : void 0 : void 0) === 'Model') && (right != null ? (_ref20 = right.callee) != null ? (_ref21 = _ref20.property) != null ? _ref21.name : void 0 : void 0 : void 0) === 'extend') {
          name = node.id.name;
          models.add(name, right);
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if (((_ref22 = right.callee) != null ? (_ref23 = _ref22.object) != null ? (_ref24 = _ref23.object) != null ? _ref24.name : void 0 : void 0 : void 0) === 'Ember' && (view_type = (_ref25 = right.callee) != null ? (_ref26 = _ref25.object) != null ? _ref26.property.name : void 0 : void 0) && (view_type === 'Checkbox' || view_type === 'TextField' || view_type === "Select" || view_type === 'TextArea' || view_type === 'View')) {
          name = node.id.name;
          switch (view_type) {
            case 'Checkbox':
              return checkbox_views.add(name, node.right);
            case 'TextField':
              return textfield_views.add(name, node.right);
            case 'TextArea':
              return textarea_views.add(name, node.right);
            case 'Select':
              return select_views.add(name, node.right);
            case 'View':
              return view_views.add(name, node.right);
          }
        }
      },
      AssignmentExpression: function(node) {
        var controller_type, ember_temp, name, right, view_type, _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref20, _ref21, _ref22, _ref23, _ref24, _ref25, _ref26, _ref27, _ref28, _ref29, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
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
            if (name != null) {
              if (emberComponents.has(name)) {
                emberComponents.add('Application', right);
              } else {
                ember_temp = new CodeCatalog();
                ember_temp.add('Application', right);
                emberComponents.add(name, ember_temp.toJSON());
              }
            }
          }
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if (((_ref9 = node.right.callee) != null ? (_ref10 = _ref9.object) != null ? (_ref11 = _ref10.object) != null ? _ref11.name : void 0 : void 0 : void 0) === 'Ember' && (controller_type = (_ref12 = node.right.callee) != null ? (_ref13 = _ref12.object) != null ? _ref13.property.name : void 0 : void 0) && (controller_type === 'ArrayController' || controller_type === 'ObjectController') && ((_ref14 = node.right) != null ? (_ref15 = _ref14.callee) != null ? (_ref16 = _ref15.property) != null ? _ref16.name : void 0 : void 0 : void 0) === 'extend') {
          name = node.left;
          astUtils.nodeWalk(node.left, nullFn, {
            Identifier: function(node) {
              return name = node.name;
            }
          });
          if (controller_type === 'ArrayController') {
            array_controllers.add(name, node.right);
          } else {
            object_controllers.add(name, node.right);
          }
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if (((_ref17 = node.right.callee) != null ? (_ref18 = _ref17.object) != null ? (_ref19 = _ref18.object) != null ? _ref19.name : void 0 : void 0 : void 0) === 'DS' && (((_ref20 = node.right.callee) != null ? (_ref21 = _ref20.object) != null ? _ref21.property.name : void 0 : void 0) === 'Model') && ((_ref22 = node.right) != null ? (_ref23 = _ref22.callee) != null ? (_ref24 = _ref23.property) != null ? _ref24.name : void 0 : void 0 : void 0) === 'extend') {
          name = node.left;
          astUtils.nodeWalk(node.left, nullFn, {
            Identifier: function(node) {
              return name = node.name;
            }
          });
          models.add(name, node.right);
        }

        /*
         * Check for Ember.ObjectController/ArrayController.extend
         */
        if (((_ref25 = right.callee) != null ? (_ref26 = _ref25.object) != null ? (_ref27 = _ref26.object) != null ? _ref27.name : void 0 : void 0 : void 0) === 'Ember' && (view_type = (_ref28 = right.callee) != null ? (_ref29 = _ref28.object) != null ? _ref29.property.name : void 0 : void 0) && (view_type === 'Checkbox' || view_type === 'TextField' || view_type === "Select" || view_type === 'TextArea' || view_type === 'View')) {
          astUtils.nodeWalk(node.left, nullFn, {
            Identifier: function(node) {
              return name = node.name;
            }
          });
          switch (view_type) {
            case 'Checkbox':
              return checkbox_views.add(name, node.right);
            case 'TextField':
              return textfield_views.add(name, node.right);
            case 'TextArea':
              return textarea_views.add(name, node.right);
            case 'Select':
              return select_views.add(name, node.right);
            case 'View':
              return view_views.add(name, node.right);
          }
        }
      },
      CallExpression: function(node) {
        var name, _ref, _ref1;
        name = void 0;
        if (((_ref = node.property) != null ? _ref.name : void 0) === 'map' && ((_ref1 = node.callee) != null ? _ref1.property.name : void 0) === 'Router') {
          name = node.callee.object.name;
          return emberComponents.add('Router', node);
        }
      }
    });
    controllers.add('ArrayControllers', array_controllers.toJSON());
    controllers.add('ObjectControllers', object_controllers.toJSON());
    views.add('CheckboxViews', checkbox_views.toJSON());
    views.add('TextFieldViews', textfield_views.toJSON());
    views.add('TextAreaView', textarea_views.toJSON());
    views.add('SelectView', select_views.toJSON());
    views.add('ViewViews', view_views.toJSON());
    emberComponents.add('Models', models.toJSON());
    emberComponents.add('Views', views.toJSON());
    emberComponents.add('Controllers', controllers.toJSON());
    return emberComponents;
  };

  findAngularDefinitions = function(ast, angularDefs) {};

  module.exports = {
    findMVC: findMVCDefinitions
  };

}).call(this);
