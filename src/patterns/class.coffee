fs    = require 'fs'
_     = require 'lodash'
RSVP  = require 'rsvp'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'

{q}         = require '../utils'
astUtils    = require '../ast'
CodeCatalog = require('../code-catalog').CodeCatalog
NODE_TYPES  = require('../types').types

THIS_EXPRESSION_TYPE      = 'ThisExpression'
FUNCTION_EXPRESSION_TYPE  = 'FunctionExpression'

# -----------------------------------------------------------------------------

findClassDefinitions = (ast) ->

  classDefinitions = new CodeCatalog()
  capitalizedVars  = new CodeCatalog()

  nodeTypeVector = astUtils.getNodeTypes(ast)

  ###
  # TODO
  #
  # match on CoffeeScript's class syntax?
  ###

  nullFn = () -> null
  SEARCH_DEPTH = 10

  String::isCapitalized = () -> @charAt(0).toUpperCase() is @charAt(0)

  # First pass: find the names of variables that might be classes
  astUtils.nodeWalk(ast, nullFn, {
    AssignmentExpression: (node) ->
      # 'app.MyClass = ...'
      if node.left.type is 'MemberExpression'
        klass = node.left.property.name
        if klass.isCapitalized()
          capitalizedVars.add(klass, node.right)

      # 'MyClass = ...'
      else if node.left.type is 'Identifier'
        klass = node.left.name
        if klass.isCapitalized()
          capitalizedVars.add(klass, node.right)

    # 'var MyClass = ...'
    VariableDeclarator: (node) ->
      klass = node.id.name
      if node.init? and klass.isCapitalized()
        capitalizedVars.add(klass, node.init)

    # 'function MyClass (...) { ... }'
    FunctionDeclaration: (node) ->
      klass = node.id?.name
      if klass? and klass.isCapitalized()
        capitalizedVars.add(klass, node)

  }, SEARCH_DEPTH)


  # ===========================================================================

  simpleClassDefinitionHelper = (node, klass) ->
    return unless capitalizedVars.has(klass)
    astUtils.nodeWalk(node, nullFn, {
      # this.foo = ...
      MemberExpression: (node) ->
        if node.object.type is THIS_EXPRESSION_TYPE
          classDefinitions.add(klass, capitalizedVars.get(klass))
    })

  # ---------------------------------------------------------------------------

  # Second pass: verify that the capitalized names are classes by looking for
  # signs of a class-like definition
  astUtils.nodeWalk(ast, nullFn, {

    # MyClass.prototype = ...
    MemberExpression: (node) ->
      klass = node.object.name
      if node.property.name is 'prototype' and capitalizedVars.has(klass)
        classDefinitions.add(klass, capitalizedVars.get(klass))

    # function MyClass (...) {
    #   this.foo = ...
    #   ...
    # }
    FunctionDeclaration: (node) ->
      if (klass = node.id?.name)?
        simpleClassDefinitionHelper(node, klass)

    AssignmentExpression: (node) ->
      # app.MyClass = function (...) {
      #   this.foo = ...
      #   ...
      # }
      if node.left.type is 'MemberExpression'
        klass = node.left.property.name
        if node.right.type is FUNCTION_EXPRESSION_TYPE
          simpleClassDefinitionHelper(node, klass)

      # MyClass = function (...) {
      #   this.foo = ...
      #   ...
      # }
      else if node.left.type is 'Identifier'
        klass = node.left.name
        if node.right.type is FUNCTION_EXPRESSION_TYPE
          simpleClassDefinitionHelper(node, klass)

    # var MyClass = (...) {
    #   this.foo = ...
    #   ...
    # }
    VariableDeclarator: (node) ->
      klass = node.id.name
      if klass? and node.init?.type is FUNCTION_EXPRESSION_TYPE
        simpleClassDefinitionHelper(node, klass)

  }, SEARCH_DEPTH)

  return classDefinitions.toJSON()

# -----------------------------------------------------------------------------

module.exports =
  findClasses: findClassDefinitions

