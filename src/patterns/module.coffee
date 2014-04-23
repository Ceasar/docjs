###
# Identify the 'module' pattern
###
_     = require 'lodash'
acorn = require 'acorn'
fs    = require 'fs'
path  = require 'path'

astUtils        = require '../ast'
{ModulePattern} = require '../code-catalog'
{q}             = require '../utils'


getName = (node) ->
  if astUtils.isIdentifier(node)
    return node.name
  else if astUtils.isLiteral(node)
    return node.value
  else
    throw new Error("Node #{node.type} is not a Literal or Identifier")

findIdentifierLoc = (stmts, name) ->
  for stmt in stmts.slice().reverse() # Search backward
    if astUtils.isFunctionDeclaration(stmt) and stmt.id.name is name
      return stmt.loc
    if astUtils.isVariableDeclaration(stmt)
      for {id, init} in stmt.declarations.slice().reverse() # Search backward
        if astUtils.isIdentifier(id) and id.name is name
          return stmt.loc
        debugger # TODO handle other cases

###
# TODO: documentation
###
getModuleMembers = (stmts, moduleName) ->
  module = new ModulePattern()

  for stmt in stmts
    if (astUtils.isExpressionStatement(stmt) and
        astUtils.isAssignmentExpression(stmt.expression) and
        astUtils.isMemberExpression(stmt.expression.left) and
        moduleName is stmt.expression.left.object.name)
      {left, right} = stmt.expression
      name = getName(left.property)
      module.addPointer(name, right.loc)

  return module

# If a node is a module, return the module definition, else return null
getModule = (node) ->
  return null unless astUtils.isIIFE(node)

  # TODO: handle case where expression is fat-arrow-function
  body        = node.callee.body.body
  returnExpr  =  _.find(body, astUtils.isReturnStatement)?.argument
  return null unless returnExpr

  module = new ModulePattern()
  if astUtils.isObjectExpression(returnExpr)
    for {key, value, kind} in returnExpr.properties
      # TODO: don't ignore getter/setters and identifiers
      name = getName(key)
      if astUtils.isIdentifier(value)
        loc = findIdentifierLoc(body, value.name)
      else
        loc = value.loc
      module.addPointer(name, loc)
    return module
  else if astUtils.isIdentifier(returnExpr)
    return getModuleMembers(body, returnExpr.name)
  else
    return null

# Determine module methods:
# If return is object literal:
# - Look at fields
#   - If not literals: deref to functions/vars
# If return is variable:
# - If variable declared as object above:
#   - Lookup inits of properties of that object
# - Else abort

findModuleDefinitions = (ast) ->
  docs =
    iifes:    []
    srcs:     []
    modules:  []

  astUtils.nodeWalk ast, (node) ->
    if astUtils.isVariableDeclaration(node)
      for {id, init} in node.declarations
        module = getModule(init)
        if module
          module.name = id.name
          docs.modules.push(module)
          docs.iifes.push(init)

          # TODO: remove synchronous call
          source = fs.readFileSync(node.loc.source, 'utf8')
          docs.srcs.push(astUtils.getNodeSrc(node, source))

  if _.every([docs.iifes, docs.srcs, docs.modules], _.isEmpty)
    # Exit if no modules were found.
    return null
  else
    return docs

module.exports =
  findModules: findModuleDefinitions

