fs    = require 'fs'
_     = require 'lodash'
RSVP  = require 'rsvp'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'

{q}         = require './utils'
astUtils    = require './ast'
NODE_TYPES  = require('./types').types


findClassDefinitions = (ast) ->
  classDefinitions = {}

  nodeTypeVector = astUtils.getNodeTypes(ast)

  ###
  # TODO
  #
  # * match on CoffeeScript's class syntax
  ###

  nullFn = () -> null
  SEARCH_DEPTH  = 10

  String::isCapitalized = () -> @charAt(0).toUpperCase() is @charAt(0)

  capitalizedVars = {}

  # First pass: find the names of variables that might be classes
  astUtils.nodeWalk(ast, nullFn, {
    AssignmentExpression: (node) ->
      # 'app.MyClass = ...'
      if node.left.type is 'MemberExpression'
        klass = node.left.property.name
        capitalizedVars[klass] = node.right if klass.isCapitalized()

      # 'MyClass = ...'
      else if node.left.type is 'Identifier'
        klass = node.left.name
        capitalizedVars[klass] = node.right if klass.isCapitalized()

    # 'var MyClass = ...'
    VariableDeclarator: (node) ->
      klass = node.id.name
      capitalizedVars[klass] = node.init if node.init? and klass.isCapitalized()

    # 'function MyClass (...) { ... }'
    FunctionDeclaration: (node) ->
      klass = node.id?.name
      capitalizedVars[klass] = node if klass? and klass.isCapitalized()

  }, SEARCH_DEPTH)


  # Second pass: verify by looking for `.prototype` stuff
  # TODO: is it valid?
  astUtils.nodeWalk(ast, nullFn, {
    MemberExpression: (node) ->
      if node.property.name is 'prototype'
        klass = node.object.name
        unless classDefinitions[klass]?
          classDefinitions[klass] = capitalizedVars[klass]

  }, SEARCH_DEPTH)

  return classDefinitions

q(fs.readFile, 'analysis/targets/classes.js', 'utf8')
  .then(acorn.parse)
  .then(findClassDefinitions)
  .then(console.log)
  .catch(console.error)

