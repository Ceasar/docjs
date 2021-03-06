fs    = require 'fs'
_     = require 'lodash'
RSVP  = require 'rsvp'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'

{CodeCatalog, ClassPattern} = require('../code-catalog')
{q}         = require '../utils'
astUtils    = require '../ast'
NODE_TYPES  = astUtils.TYPES

# -----------------------------------------------------------------------------

###
# Generate CodeCatalogs containing information about JS class definitions in the
# target source code.
#
# NOTE: expects the `loc` object to be available in AST nodes.
###
findClassDefinitions = (ast) ->

  classDefinitions  = {}
  capitalizedVars   = new CodeCatalog(ast.loc.source)

  # Get a handle on className's catalog or create it if needed.
  getClassPattern = (className) ->
    return classDefinitions[className] or
        (classDefinitions[className] = new ClassPattern className)

  nullFn = () -> null
  SEARCH_DEPTH = 10

  # First pass: find the names of variables that might be classes
  astUtils.nodeWalk(ast, nullFn, {

    AssignmentExpression: (node) ->
      # 'app.MyClass = ...'
      if node.left.type is 'MemberExpression'
        prop = (node.left.property.name or node.left.property.value)
        if prop? and _.isString(prop) and prop.isCapitalized()
          capitalizedVars.pointer(prop, node.right.loc)

      # 'MyClass = ...'
      else if node.left.type is 'Identifier'
        className = node.left.name
        if className.isCapitalized()
          capitalizedVars.pointer(className, node.right.loc)

    # 'var MyClass = ...'
    VariableDeclarator: (node) ->
      className = node.id.name
      if node.init? and className.isCapitalized()
        capitalizedVars.pointer(className, node.init.loc)

    # 'function MyClass (...) { ... }'
    FunctionDeclaration: (node) ->
      className = node.id?.name
      if className? and className.isCapitalized()
        capitalizedVars.pointer(className, node.loc)

  }, SEARCH_DEPTH)


  # ===========================================================================

  # Accepts an AssignmentExpression node, assumes this is an assignment to
  # `.prototype`.
  catalogInheritance = (node, className) ->
    klass = getClassPattern(className)

    r = node.right

    # MyClass.prototype = Object.create(ParentClass)
    if (r.type is 'CallExpression' and
        r.callee.type is 'MemberExpression' and
        r.callee.object.name is 'Object' and
        r.callee.property.name is 'create' and
        r.arguments.length and
        r.arguments[0].name?)
      klass.parent = node.right.arguments[0].name

    if r.type is 'NewExpression'
      # MyClass.prototype = new <obj>.ParentClass()
      if r.callee.type is 'MemberExpression'
        klass.parent = r.callee.property.name

      # MyClass.prototype = new ParentClass()
      if r.callee.type is 'Identifier'
        klass.parent = r.callee.name

  # Accepts an AssignmentExpression node
  catalogAssignedMethodOrPattern = (node, className) ->
    klass = getClassPattern(className)

    # Check if the MemberExpression is for a class property or method.
    prop = (node.left.property.name or node.left.property.value)

    if node.right.type is 'FunctionExpression'
      klass.addMethod(prop, node.loc)

    else if prop isnt 'prototype'
      klass.addProperty(prop, node.loc)


  # Walk the nodes in an AST subtree looking for class methods and properties.
  inspectClassConstructor = (node, className) ->
    return unless capitalizedVars.pointer(className)?

    # -----------------------------------------------
    # <parent-syntax> { ... }
    astUtils.nodeWalk(node, nullFn, {

      # this.foo = ...
      AssignmentExpression: (node) ->
        if node.left.type is 'MemberExpression'
          if node.left.object.type is 'ThisExpression'
            catalogAssignedMethodOrPattern(node, className)

          prop = node.left.property.name or node.left.property.value
          if prop is 'property'
            catalogInheritance(node, className)

    })

  # ---------------------------------------------------------------------------

  # Second pass: verify that the capitalized names are classes by looking for
  # signs of a class-like definition.
  astUtils.nodeWalk(ast, nullFn, {

    # function MyClass (...) { ... }
    FunctionDeclaration: (node) ->
      if (className = node.id?.name)?
        inspectClassConstructor(node, className)

    AssignmentExpression: (node) ->
      # app.MyClass = function (...) { ... }
      if node.left.type is 'MemberExpression'
        className = (node.left.property.name or node.left.property.value)
        if node.right.type is 'FunctionExpression'
          inspectClassConstructor(node, className)

        # MyClass.prototype = ...
        className = node.left.object.name
        prop      = node.left.property.name or node.left.property.value
        if (prop is 'prototype' and
            capitalizedVars.pointer(className)?)
          catalogInheritance(node, className)

      # MyClass = function (...) { ... }
      else if node.left.type is 'Identifier'
        className = node.left.name
        if node.right.type is 'FunctionExpression'
          inspectClassConstructor(node, className)

    # var MyClass = function (...) { ... }
    VariableDeclarator: (node) ->
      className = node.id.name
      if className? and node.init?.type is 'FunctionExpression'
        inspectClassConstructor(node, className)

  }, SEARCH_DEPTH)

  return _.values(classDefinitions)

# -----------------------------------------------------------------------------

module.exports =
  findClasses: findClassDefinitions

