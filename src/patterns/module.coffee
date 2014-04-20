###
# Identify the 'module' pattern given an AST.
###
_     = require 'lodash'
acorn = require 'acorn'
fs    = require 'fs'
path  = require 'path'

ast = require '../ast'
{q} = require '../utils'

# -----------------------------------------------------------------------------

getName = (node) ->
  if ast.isIdentifier(node)
    return node.name
  else if ast.isLiteral(node)
    return node.value
  else
    throw new Error("Node #{node.type} is not a Literal or Identifier")

findIdentifierLoc = (stmts, name) ->
  for stmt in stmts.slice().reverse() # Search backward
    if ast.isFunctionDeclaration(stmt) and stmt.id.name is name
      return stmt.loc
    if ast.isVariableDeclaration(stmt)
      for {id, init} in stmt.declarations.slice().reverse() # Search backward
        if ast.isIdentifier(id) and id.name is name
          return stmt.loc
        debugger # TODO handle other cases

getModuleMembers = (stmts, moduleName) ->
  module = new Module()
  for stmt in stmts
    if (ast.isExpressionStatement(stmt) and
        ast.isAssignmentExpression(stmt.expression) and
        ast.isMemberExpression(stmt.expression.left) and
        moduleName is stmt.expression.left.object.name)
      {left, right} = stmt.expression
      name = getName(left.property)
      module.api.push(new CodePointer(name, right.loc))
  return module

# If a node is a module, return the module definition, else return null
getModule = (node) ->
  return null unless ast.isIIFE(node)

  # TODO might be expression if fat-arrow-function
  body        = node.callee.body.body
  returnExpr  =  _.find(body, ast.isReturnStatement)?.argument
  return null unless returnExpr

  module = new Module()
  if ast.isObjectExpression(returnExpr)
    for {key, value, kind} in returnExpr.properties
      # TODO: don't ignore getter/setters and identifiers
      name = getName(key)
      if ast.isIdentifier(value)
        loc = findIdentifierLoc(body, value.name)
      else
        loc = value.loc
      codePointer = new CodePointer(name, loc)
      module.api.push(codePointer)
    return module
  else if ast.isIdentifier(returnExpr)
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

class CodePointer
  constructor: (@name, loc) ->
    @start = loc.start.line

class Module
  constructor: (@name, @api=[]) ->

moduleDir = 'analysis/examples/modules'

programs = fs.readdirSync(moduleDir).map (file) ->
  file    = path.join(moduleDir, file)
  fileStr = fs.readFileSync(file, 'utf8')
  acorn.parse fileStr,
    locations: true
    sourceFile: file

iifes   = []
srcs    = []
modules = []

for program in programs
  ast.nodeWalk program, (node) ->
    if ast.isIIFE(node)
      iifes.push(node)
      modules.push(getModule(node))
      # TODO: remove synchronous call
      srcs.push(ast.getNodeSrc(node, fs.readFileSync(node.loc.source, 'utf8')))

