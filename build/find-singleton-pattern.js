(function() {
  var CodeCatalog, MEMBER_EXPRESSION, Model, NODE_TYPES, OBJECT_EXPRESSION, RETURN_STATEMENT, RSVP, acorn, astUtils, findSingletonDefinition, fs, nullFn, q, walk, _;

  fs = require('fs');

  _ = require('lodash');

  RSVP = require('rsvp');

  Model = require('fishbone');

  acorn = require('acorn');

  walk = require('acorn/util/walk');

  CodeCatalog = require('./code-catalog').CodeCatalog;

  q = require('./utils').q;

  astUtils = require('./ast');

  NODE_TYPES = require('./types').types;

  OBJECT_EXPRESSION = 'ObjectExpression';

  RETURN_STATEMENT = 'ReturnStatement';

  MEMBER_EXPRESSION = 'MemberExpression';

  nullFn = function() {
    return null;
  };

  findSingletonDefinition = function(ast) {
    var singletons;
    singletons = new CodeCatalog();
    astUtils.nodeWalk(ast, nullFn, {
      VariableDeclaration: function(node) {
        var init, initFunction, instance, privateMethods, privateProperties, publicMethods, publicProperties, singletonDef;
        singletonDef = new CodeCatalog();
        privateMethods = new CodeCatalog();
        privateProperties = new CodeCatalog();
        publicMethods = new CodeCatalog();
        publicProperties = new CodeCatalog();
        init = void 0;
        instance = void 0;
        astUtils.nodeWalk(node, nullFn, {
          ReturnStatement: function(ret_node) {
            var containsExistance, _ref;
            if (((_ref = ret_node.argument) != null ? _ref.type : void 0) === 'ObjectExpression') {
              containsExistance = false;
              _.map(ret_node.argument.properties, function(pair) {
                var fun_node, isSingleton;
                if (pair.value.type === 'FunctionExpression') {
                  fun_node = pair.value;
                  isSingleton = false;
                  return astUtils.nodeWalk(fun_node, nullFn, {
                    IfStatement: function(if_node) {
                      var test;
                      test = if_node.test;
                      if (test.operator === '!' && test.argument.type === 'Identifier') {
                        instance = test.argument.name;
                        return astUtils.nodeWalk(if_node, nullFn, {
                          AssignmentExpression: function(node) {
                            if (node.left.name === instance && node.right.type === 'CallExpression') {
                              isSingleton = true;
                              return init = node.right.callee.name;
                            }
                          }
                        });
                      }
                    },
                    ReturnStatement: function(final_ret_node) {}
                  });
                }
              });
              return astUtils.nodeWalk(ret_node.argument.properties, nullFn, {
                FunctionDeclaration: function(fun_node) {}
              });
            }
          }
        });
        if (instance) {
          initFunction = false;
          astUtils.nodeWalk(node, nullFn, {
            FunctionDeclaration: function(fun_node) {
              if (fun_node.id.name === init) {
                initFunction = true;
                return astUtils.nodeWalk(fun_node, nullFn, {
                  ReturnStatement: function(ret_node) {
                    return _.map(ret_node.argument.properties, function(prop) {
                      if (prop.value.type === 'FunctionExpression') {
                        return publicMethods.add(prop.key.name, prop.value);
                      } else if (prop.value.type === 'Literal') {
                        return publicProperties.add(prop.key.name, prop.value);
                      }
                    });
                  },
                  FunctionDeclaration: function(priv_fun_node) {
                    var _ref;
                    if (!publicMethods.has((_ref = priv_fun_node.id) != null ? _ref.name : void 0)) {
                      return privateMethods.add(priv_fun_node.id.name, priv_fun_node);
                    }
                  },
                  VariableDeclaration: function(priv_var_node) {
                    return _.map(priv_var_node.declarations, function(decl) {
                      var _ref;
                      if (!publicProperties.has((_ref = decl.id) != null ? _ref.name : void 0)) {
                        return privateProperties.add(decl.id.name, decl.init);
                      }
                    });
                  }
                }, 2);
              }
            },
            VariableDeclaration: function(node) {}
          });
        }
        singletonDef.add('name', instance);
        singletonDef.add('init_method', init);
        singletonDef.add('private_methods', privateMethods.toJSON());
        singletonDef.add('public_methods', publicMethods.toJSON());
        singletonDef.add('private_properties', privateProperties.toJSON());
        singletonDef.add('public_properties', publicProperties.toJSON());
        if ((instance != null) && !singletons.has(instance)) {
          return singletons.add(instance, singletonDef.toJSON());
        }
      },
      FunctionDeclaration: function(node) {
        var init, initFunction, instance, privateMethods, privateProperties, publicMethods, publicProperties, singletonDef;
        singletonDef = new CodeCatalog();
        privateMethods = new CodeCatalog();
        privateProperties = new CodeCatalog();
        publicMethods = new CodeCatalog();
        publicProperties = new CodeCatalog();
        init = void 0;
        instance = void 0;
        astUtils.nodeWalk(node, nullFn, {
          ReturnStatement: function(ret_node) {
            var containsExistance, _ref;
            if (((_ref = ret_node.argument) != null ? _ref.type : void 0) === 'ObjectExpression') {
              containsExistance = false;
              _.map(ret_node.argument.properties, function(pair) {
                var fun_node, isSingleton;
                if (pair.value.type === 'FunctionExpression') {
                  fun_node = pair.value;
                  isSingleton = false;
                  return astUtils.nodeWalk(fun_node, nullFn, {
                    IfStatement: function(if_node) {
                      var test;
                      test = if_node.test;
                      if (test.operator === '!' && test.argument.type === 'Identifier') {
                        instance = test.argument.name;
                        return astUtils.nodeWalk(if_node, nullFn, {
                          AssignmentExpression: function(node) {
                            if (node.left.name === instance && node.right.type === 'CallExpression') {
                              isSingleton = true;
                              return init = node.right.callee.name;
                            }
                          }
                        });
                      }
                    },
                    ReturnStatement: function(final_ret_node) {}
                  });
                }
              });
              return astUtils.nodeWalk(ret_node.argument.properties, nullFn, {
                FunctionDeclaration: function(fun_node) {}
              });
            }
          }
        });
        if (instance) {
          initFunction = false;
          astUtils.nodeWalk(node, nullFn, {
            FunctionDeclaration: function(fun_node) {
              if (fun_node.id.name === init) {
                initFunction = true;
                return astUtils.nodeWalk(fun_node, nullFn, {
                  ReturnStatement: function(ret_node) {
                    return _.map(ret_node.argument.properties, function(prop) {
                      if (prop.value.type === 'FunctionExpression') {
                        return publicMethods.add(prop.key.name, prop.value);
                      } else if (prop.value.type === 'Literal') {
                        return publicProperties.add(prop.key.name, prop.value);
                      }
                    });
                  },
                  FunctionDeclaration: function(priv_fun_node) {
                    var _ref;
                    if (!publicMethods.has((_ref = priv_fun_node.id) != null ? _ref.name : void 0)) {
                      return privateMethods.add(priv_fun_node.id.name, priv_fun_node);
                    }
                  },
                  VariableDeclaration: function(priv_var_node) {
                    return _.map(priv_var_node.declarations, function(decl) {
                      var _ref;
                      if (!publicProperties.has((_ref = decl.id) != null ? _ref.name : void 0)) {
                        return privateProperties.add(decl.id.name, decl.init);
                      }
                    });
                  }
                }, 2);
              }
            },
            VariableDeclaration: function(node) {}
          });
        }
        singletonDef.add('name', instance);
        singletonDef.add('init_method', init);
        singletonDef.add('private_methods', privateMethods.toJSON());
        singletonDef.add('public_methods', publicMethods.toJSON());
        singletonDef.add('private_properties', privateProperties.toJSON());
        singletonDef.add('public_properties', publicProperties.toJSON());
        if ((instance != null) && !singletons.has(instance)) {
          return singletons.add(instance, singletonDef.toJSON());
        }
      }
    });
    console.log(singletons.toJSON());
    return singletons.toJSON();
  };

  exports.getPromise = function(targetFile) {
    return q(fs.readFile, targetFile, 'utf8').then(_.partialRight(acorn.parse, {
      locations: true
    })).then(findSingletonDefinition);
  };

}).call(this);
