fs    = require 'fs'
_     = require 'lodash'
RSVP  = require 'rsvp'
Model = require 'fishbone'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'
CodeCatalog = require('./code-catalog').CodeCatalog

{q}         = require './utils'
astUtils    = require './ast'
NODE_TYPES  = require('./types').types


OBJECT_EXPRESSION = 'ObjectExpression'
RETURN_STATEMENT = 'ReturnStatement'
MEMBER_EXPRESSION = 'MemberExpression'

nullFn = -> null
findSingletonDefinition = (ast) ->
# TODO: only works to find a single singleton because of the way codecatalog is setup

  singletonDef = new CodeCatalog()
  privateMethods = new CodeCatalog()
  privateProperties = new CodeCatalog()
  publicMethods = new CodeCatalog()
  publicProperties = new CodeCatalog()
  init = undefined
  instance = undefined
  astUtils.nodeWalk ast, nullFn, {
    # find a function or variable declaration
    VariableDeclaration: (node) ->
      # --------------------------------------------------------------------------
      # run first pass
      # --------------------------------------------------------------------------
      # check that it returns an object
      # check the returned object, see if it contains a function that:
      #   contains a check for existance (!<Instance>)
      #   If it does, look for an assignment of a function call to that instance.
      #   If it exists, take down the instance as well as the function call for
      #   the second pass
      # start the checks
      astUtils.nodeWalk node, nullFn, {
        ReturnStatement: (ret_node) ->
          # at the topmost level, check if return an object
          if ret_node.argument?.type == 'ObjectExpression'
            # continue the check - Look for a function that checks existance and returns a variable
            containsExistance = false


            # pluck all the function expressions
            _.map ret_node.argument.properties, (pair) ->
              if(pair.value.type == 'FunctionExpression')
                fun_node = pair.value
                # run through and look for an if
                isSingleton = false
                astUtils.nodeWalk fun_node, nullFn, {
                  IfStatement: (if_node) ->
                   # check if there's a unary expression comparing a !<Identifier>
                    test = if_node.test
                    if(test.operator == '!' && test.argument.type == 'Identifier')
                      # run through the if statement, search for assigning the istance
                      instance = test.argument.name

                      astUtils.nodeWalk if_node, nullFn, {
                        AssignmentExpression: (node) ->
                          # if the left side's name is the same as `instance`
                          # and the right is a CallExpression
                          # then we know the left is the instance and the right
                          # is the init instance method
                          if(node.left.name == instance and node.right.type == 'CallExpression')
                            # then this is a singleton!!!
                            # set the call expression's name as the init method
                            isSingleton = true
                            init = node.right.callee.name # name of method
                      }

                  ReturnStatement: (final_ret_node) ->
                    # have another check to verify instance
                    # if isSingleton
                    #   instance
                      # if the return statement, then the argument is the instance
                      # final_ret_node.argument
                }

            astUtils.nodeWalk ret_node.argument.properties, nullFn, {
              FunctionDeclaration: (fun_node) ->
            }
      }
      # --------------------------------------------------------------------------
      # run second pass on node
      # --------------------------------------------------------------------------
      # check for an init() function
      # check for a function that
      # 1. returns an object with various properties and methods
      # 2. Find the method that generates the instance (identified above)
      #   Look inside this function
      #     Label private, public methods/variables

      initFunction = false
      # start the checks - this should be the exact same as the FunctionDeclaration checks
      astUtils.nodeWalk node, nullFn, {
        FunctionDeclaration: (fun_node) ->
          # check if it's name is equal to init
          if(fun_node.id.name == init)
            # it's the function node
            initFunction = true  # used for checking return statement
            # walk the initFunction, find any declarations
            astUtils.nodeWalk fun_node, nullFn, {
              ReturnStatement: (ret_node) ->
                # walk the return statement. Everything inside the object is
                _.map ret_node.argument.properties, (prop) ->
                  # walk the properties
                  if(prop.value.type == 'FunctionExpression')
                    publicMethods.add(prop.key.name, prop.value)

                  else if(prop.value.type == 'Literal')
                    publicProperties.add(prop.key.name, prop.value)


              FunctionDeclaration: (priv_fun_node) ->
                if(!publicMethods.has(priv_fun_node.id?.name))
                  privateMethods.add(priv_fun_node.id.name, priv_fun_node)

                # this is a private function
              VariableDeclaration: (priv_var_node) ->
                _.map priv_var_node.declarations, (decl) ->
                  if(!publicProperties.has(decl.id?.name))
                    privateProperties.add(decl.id.name, decl.init)
            }, 2  # only get the shallowest return node

        VariableDeclaration: (node) ->
          # same as functiondec

      }
    # private methods
    # public methods
    # private properties
    # public properties
    # instance, init function
    # should all be defined at this line
    FunctionDeclaration: (node) ->

      # --------------------------------------------------------------------------
      # run first pass
      # --------------------------------------------------------------------------
      # check that it returns an object
      # check the returned object, see if it contains a function that:
      #   contains a check for existance (!<Instance>)
      #   If it does, look for an assignment of a function call to that instance.
      #   If it exists, take down the instance as well as the function call for
      #   the second pass
      # start the checks
      astUtils.nodeWalk node, nullFn, {
        ReturnStatement: (ret_node) ->
          # at the topmost level, check if return an object
          if ret_node.argument?.type == 'ObjectExpression'
            # continue the check - Look for a function that checks existance and returns a variable
            containsExistance = false


            # pluck all the function expressions
            _.map ret_node.argument.properties, (pair) ->
              if(pair.value.type == 'FunctionExpression')
                fun_node = pair.value
                # run through and look for an if
                isSingleton = false
                astUtils.nodeWalk fun_node, nullFn, {
                  IfStatement: (if_node) ->
                    # check if there's a unary expression comparing a !<Identifier>
                    test = if_node.test
                    if(test.operator == '!' && test.argument.type == 'Identifier')
                      # run through the if statement, search for assigning the istance
                      instance = test.argument.name

                      astUtils.nodeWalk if_node, nullFn, {
                        AssignmentExpression: (node) ->
                          # if the left side's name is the same as `instance`
                          # and the right is a CallExpression
                          # then we know the left is the instance and the right
                          # is the init instance method
                          if(node.left.name == instance and node.right.type == 'CallExpression')
                            # then this is a singleton!!!
                            # set the call expression's name as the init method
                            isSingleton = true
                            init = node.right.callee.name # name of method
                      }

                  ReturnStatement: (final_ret_node) ->
                    # have another check to verify instance
                    # if isSingleton
                    #   instance
                      # if the return statement, then the argument is the instance
                      # final_ret_node.argument
                }

            astUtils.nodeWalk ret_node.argument.properties, nullFn, {
              FunctionDeclaration: (fun_node) ->
            }
      }
      # --------------------------------------------------------------------------
      # run second pass on node
      # --------------------------------------------------------------------------
      # check for an init() function
      # check for a function that
      # 1. returns an object with various properties and methods
      # 2. Find the method that generates the instance (identified above)
      #   Look inside this function
      #     Label private, public methods/variables

      initFunction = false
      # start the checks - this should be the exact same as the FunctionDeclaration checks
      astUtils.nodeWalk node, nullFn, {
        FunctionDeclaration: (fun_node) ->
          # check if it's name is equal to init
          if(fun_node.id.name == init)
            # it's the function node
            initFunction = true  # used for checking return statement
            # walk the initFunction, find any declarations
            astUtils.nodeWalk fun_node, nullFn, {
              ReturnStatement: (ret_node) ->
                # walk the return statement. Everything inside the object is
                _.map ret_node.argument.properties, (prop) ->
                  # walk the properties
                  if(prop.value.type == 'FunctionDeclaration')
                    publicMethods.add(prop.key.name, prop.value)

                  else if(prop.value.type == 'Literal')
                    publicProperties.add(prop.key.name, prop.value)


              FunctionDeclaration: (priv_fun_node) ->
                if(!publicMethods.has(priv_fun_node.id?.name))
                  privateMethods.add(priv_fun_node.id.name, priv_fun_node)

                # this is a private function
              VariableDeclaration: (priv_var_node) ->
                _.map priv_var_node.declarations, (decl) ->
                  if(!publicProperties.has(decl.id?.name))
                    privateMethods.add(decl.id.name, decl.init)
            }, 2  # only get the shallowest return node

        VariableDeclaration: (node) ->
          # same as functiondec

      }
    # private methods
    # public methods
    # private properties
    # public properties
    # instance, init function
    # should all be defined at this line
  }


  singletonDef.add('name', instance)
  singletonDef.add('init_method', init)
  singletonDef.add('private_methods', privateMethods.toJSON())
  singletonDef.add('public_methods', publicMethods.toJSON())
  singletonDef.add('private_properties', privateProperties.toJSON())
  singletonDef.add('public_properties', publicProperties.toJSON())
  console.log singletonDef.toJSON()
  return 'hello'


exports.getPromise = (targetFile) ->
  q(fs.readFile, targetFile, 'utf8')
    .then(_.partialRight acorn.parse, {locations: true})
    .then(findSingletonDefinition)


