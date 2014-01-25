fs    = require 'fs'
_     = require 'lodash'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'


# Check if a given value is a subtree in the Parser API
isSubTree = (obj) ->
  return false unless obj?

  # If an array, each element should be a node with a 'type' property
  if _.isArray(obj) and obj.length > 0
    return obj[0].type?
  # Otherwise, this should be a node itself
  else
    return obj.type?

# Combine a list of hashes into a single object
combineHashes = (hashes) ->
  combined = {}
  for h in hashes
    for own nodeType, count of h
      combined[nodeType] = 0 unless combined[nodeType]?
      combined[nodeType] += count
  return combined

computeHash = (node) ->
  hashes = []

  for own k, v of node
    if v.hash?
      hashes.push(v.hash)
    else if _.isArray(v)
      for child in v
        hashes.push(child.hash) if child.hash?

  hash = if hashes.length then combineHashes(hashes) else {}
  hash[node.type] = if hash[node.type]? then hash[node.type] + 1 else 1
  return hash

# Look at documented iterator pattern and compute its hash
fs.readFile 'patterns/iterator.js', 'utf8', (err, jsFile) ->
  if err then return console.log err

  ast = acorn.parse(jsFile)
  stringifiedAST = JSON.stringify(ast, null, 4)

  state = {}
  functions = {}

  nodeTypes = [
    'BlockStatement'
    'ExpressionStatement'
    'IfStatement'
    'WhileStatement'
    'ForStatement'
    'ObjectExpression'
    'NewExpression'
  ]

  registerNodeType = (type) -> (node, state, c) ->
    for own k, v of node
      continue unless isSubTree(v)

      # If it's an array nodes, map over them
      if _.isArray(v)
        c(n, state) for n in v
      else
        c(v, state)

    node.hash = computeHash(node)

  functions[t] = registerNodeType(t) for t in nodeTypes

  walk.recursive(ast, state, functions)
  debugger

