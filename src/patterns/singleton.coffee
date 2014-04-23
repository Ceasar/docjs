fs    = require 'fs'
_     = require 'lodash'
RSVP  = require 'rsvp'
Model = require 'fishbone'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'

CodeCatalog = require('../code-catalog').CodeCatalog
SingletonPattern = require('../code-catalog').SingletonPattern
{q}         = require '../utils'
astUtils    = require '../ast'
NODE_TYPES  = astUtils.TYPES


OBJECT_EXPRESSION = 'ObjectExpression'
RETURN_STATEMENT  = 'ReturnStatement'
MEMBER_EXPRESSION = 'MemberExpression'

findSingletonInitMethod = (if_node) ->

 # check if there's a unary expression comparing a !<Identifier>
  test = if_node.test
  if(test.operator == '!' && test.argument.type == 'Identifier')
    # run through the if statement, search for assigning the istance
    instance = test.argument.name
    init = undefined

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
    return {init, instance}

walkTopLevelSingleton = (node, singletons) ->
  singletonDef = new SingletonPattern()
  privateMethods = singletonDef.getCatalog('Private Methods')
  privateProperties = singletonDef.getCatalog('Private Properties')
  publicMethods = singletonDef.getCatalog('Public Methods')
  publicProperties = singletonDef.getCatalog('Public Properties')
  init = undefined
  instance = undefined
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
        # continue the check:
        # Look for a function that checks existance and returns a variable
        containsExistance = false


        # pluck all the function expressions
        _.map ret_node.argument.properties, (pair) ->
          if(pair.value.type == 'FunctionExpression')
            fun_node = pair.value
            # run through and look for an if
            isSingleton = false
            astUtils.nodeWalk fun_node, nullFn, {
              IfStatement: (if_node) ->
                exists = findSingletonInitMethod(if_node)
                isSingleton = exists?
                if isSingleton
                  instance = exists.instance
                  init = exists.init

              # ReturnStatement: (final_ret_node) ->
                # have another check to verify instance
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

  if(instance)
    initFunction = false
    # start the checks:
    # this should be the exact same as the FunctionDeclaration checks
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
                  publicMethods.addPointer(prop.key.name, prop.value.loc)

                else if(prop.value.type == 'Literal')
                  publicProperties.addPointer(prop.key.name, prop.value.loc)


            FunctionDeclaration: (priv_fun_node) ->
              if(!publicMethods.hasCatalog(priv_fun_node.id?.name))
                privateMethods.addPointer(priv_fun_node.id.name, priv_fun_node.loc)

              # this is a private function
            VariableDeclaration: (priv_var_node) ->
              _.map priv_var_node.declarations, (decl) ->
                if(!publicProperties.hasCatalog(decl.id?.name))
                  privateProperties.addPointer(decl.id.name, decl.init.loc)
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
  singletonDef.name = instance
  if(instance? and !singletons.hasCatalog instance)
    singletons.catalogs.push(singletonDef)


nullFn = -> null
findSingletonDefinitions = (ast) ->
  singletons = new CodeCatalog('Singletons')
  astUtils.nodeWalk ast, nullFn, {
    # find a function or variable declaration
    VariableDeclaration: (node) ->
      walkTopLevelSingleton(node, singletons)
    FunctionDeclaration: (node) ->
      walkTopLevelSingleton(node, singletons)
  }
  return singletons


module.exports =
  findSingletons: findSingletonDefinitions
