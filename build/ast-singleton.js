(function() {
  var CodeCatalog, MEMBER_EXPRESSION, Model, NODE_TYPES, OBJECT_EXPRESSION, RETURN_STATEMENT, RSVP, acorn, astUtils, findSingletonDefinition, fs, nullFn, q, walk, _,
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

  OBJECT_EXPRESSION = 'ObjectExpression';

  RETURN_STATEMENT = 'ReturnStatement';

  MEMBER_EXPRESSION = 'MemberExpression';


  /*
   * Adds events to simple JS objects.
   * Prevents overwriting of entries (unless you remove that name first).
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

  nullFn = function() {
    return null;
  };

  findSingletonDefinition = function(ast) {
    var privateMethods, privateProperties, publicMethods, publicProperties, singletonPointers;
    singletonPointers = new CodeCatalog();
    privateMethods = new CodeCatalog();
    privateProperties = new CodeCatalog();
    publicMethods = new CodeCatalog();
    publicProperties = new CodeCatalog();
    return astUtils.nodeWalk(ast, nullFn, {
      FunctionDeclaration: function(node) {
        var init, initFunction, instance;
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
        initFunction = false;
        return astUtils.nodeWalk(node, nullFn, {
          FunctionDeclaration: function(fun_node) {
            if (fun_node.id.name === init) {
              initFunction = true;
              return astUtils.nodeWalk(fun_node, nullFn, {
                ReturnStatement: function(ret_node) {
                  return _.map(ret_node.argument.properties, function(prop) {
                    if (prop.value.type === 'FunctionDeclaration') {
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
                      return privateMethods.add(decl.id.name, decl.init);
                    }
                  });
                }
              }, 2);
            }
          },
          VariableDeclaration: function(node) {}
        });
      },
      VariableDeclaration: function(node) {
        var init, initFunction, instance;
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
        initFunction = false;
        return astUtils.nodeWalk(node, nullFn, {
          FunctionDeclaration: function(fun_node) {
            if (fun_node.id.name === init) {
              initFunction = true;
              return astUtils.nodeWalk(fun_node, nullFn, {
                ReturnStatement: function(ret_node) {
                  return _.map(ret_node.argument.properties, function(prop) {
                    if (prop.value.type === 'FunctionDeclaration') {
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
                      return privateMethods.add(decl.id.name, decl.init);
                    }
                  });
                }
              }, 2);
            }
          },
          VariableDeclaration: function(node) {}
        });
      }
    });
  };

  acorn.parseWithLocations = _.partialRight(acorn.parse, {
    locations: true
  });

  q(fs.readFile, 'analysis/targets/singleton.js', 'utf8').then(acorn.parseWithLocations).then(findSingletonDefinition).then(function(def) {
    debugger;
    return def;
  }).then(console.log)["catch"](console.error);

  console.log('hello');

}).call(this);
