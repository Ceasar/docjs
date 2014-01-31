fs    = require 'fs'
_     = require 'lodash'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'

NODE_TYPES = require('./types').types


# ============================================================================
# Utils
# ============================================================================

treeUtils =
  # Check if a given value is a subtree in the Parser API
  isSubTree: (obj) ->
    return false unless obj?

    # If an array, each element should be a node with a 'type' property
    if _.isArray(obj) and obj.length > 0
      return obj[0].type?
    # Otherwise, this should be a node itself
    else
      return obj.type?

projectUtils =
  getPatternFile: (name) -> "patterns/#{name}.js"

# ============================================================================
# Hashing
#
#   A "hash" for a subtree of the AST is an object that keeps track of the count
#   of each node type present in the subtree.
# ============================================================================

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

# ============================================================================
# Pattern Identification
# ============================================================================

fingerprintPattern = (patternName) ->

  patternFile = projectUtils.getPatternFile(patternName)

  # Look at documented iterator pattern and compute its hash
  fs.readFile patternFile, 'utf8', (err, jsFile) ->
    return console.log(err) if err

    ast = acorn.parse(jsFile)
    stringifiedAST = JSON.stringify(ast, null, 4)

    state = {}
    functions = {}

    registerNodeType = (type) -> (node, state, c) ->
      for own k, v of node
        continue unless treeUtils.isSubTree(v)

        # If it's an array nodes, map over them
        if _.isArray(v)
          c(n, state) for n in v
        else
          c(v, state)

      node.hash = computeHash(node)

    for t in NODE_TYPES
      functions[t] = registerNodeType(t)

    walk.recursive(ast, state, functions)

    debugger
    return ast

# ============================================================================
# Main execution
# ============================================================================
fingerprintPattern('iterator')


