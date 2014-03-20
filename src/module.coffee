###
Attempting to identify module pattern
###
_     = require 'lodash'
acorn = require 'acorn'
fs    = require 'fs'
path  = require 'path'

ast = require './ast'
{q} = require './utils'


# Return whether the node is an immediately-invoked function expression (IIFE)
isIIFE = (node) ->
  ast.isCallExpression(node) && ast.isFunctionExpression(ast.callee)

getModule = (node) ->
  if not isIIFE(node)
    return null

  body = node.callee.body # TODO might be expression if fat-arrow-function
  returnExpr =  _.find(body, ast.isReturnStatement)?.argument
  if !returnExpr
    return null

  module = new Module()
  if ast.isObjectExpression(returnExpr)
    for {key, value, kind} in returnExpr.properties
      # TODO: don't ignore getter/setters and identifiers
      name = if ast.isIdentifier(key) then key.name else key.value
      if ast.isIdentifier(value)
        TODO find referent
        referent = _.find body, (node) ->
          ast.isFunctionDeclaration(node) and
      else
        module.api.push(new CodePointer(name, value.loc))
  else if ast.isIdentifier(returnExpr)
    # TODO: lookup identifiers attached to this variable in rest of body
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
  constructor: (@name, @loc) ->

class Module
  constructor: (@api=[]) ->

moduleDir = 'analysis/examples/modules'

programs = fs.readdirSync(moduleDir).map (file) ->
  file = path.join(moduleDir, file)
  fileStr = fs.readFileSync(file, 'utf8')
  acorn.parse(fileStr, {locations: true, sourceFile: file})

iifes = []
srcs = []

for program in programs
  ast.nodeWalk program, (node) ->
    if isIIFE(node)
      iifes.push(node)
      srcs.push(ast.getNodeSrc(node, fs.readFileSync(node.loc.source, 'utf8')))
debugger
