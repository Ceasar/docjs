_ = require 'lodash'

###
#
# Utilities for working with the abstract syntax tree
#
###

# Given an AST node, return a list of its immediate children
getChildren = (node) ->
  children = []

  # Check all properties for nodes or node arrays
  for own k, v of node
    if v?.type?
      children.push(v)
    else if _.isArray(v) and v.length
      for childNode in v
        children.push(childNode) if childNode.type?

  # Special cases
  if node.type in ['LetStatement', 'LetExpression']
    for h in node.head
      children.push(h.id)
      children.push(h.init) if h.init?

  else if node.type in ['ObjectExpression', 'ObjectPattern']
    for prop in node.properties
      children.push(prop.key)
      children.push(prop.value)

  return children


###
# A generic function to walk the AST
#
# @param node   An AST node
# @param fn     Callback function, called on every child of the root node
# @param fnMap  A map of AST types to functions called on each of those types
# @param limit  How deep in the subtree to walk (default = whole tree)
###
nodeWalk = (node, fn, fnMap, limit) ->
  if limit?
    if limit > 0
      for child in getChildren(node)
        nodeWalk(child, fn, fnMap, limit - 1)
  else
    for child in getChildren(node)
      nodeWalk(child, fn, fnMap)

  fnMap[node.type](node) if fnMap?[node.type]?
  fn(node) if fn?


###
# Generate a node-type vector for a subtree, optionally limited to a depth
# limit. A "hash" for a subtree of the AST is an object that keeps track of the
# count of each node type present in the subtree.
#
# @param ast    (Object) an AST subtree
# @param depth  (Number) optional argument that limits the depth of the traversal
###
getNodeTypes = (ast, depth) ->

  combineHashes = (hashes) ->
    combined = {}
    for h in hashes
      for own nodeType, count of h
        combined[nodeType] = 0 unless combined[nodeType]?
        combined[nodeType] += count
    return combined

  computeHash = (node) ->
    hashes          = (child.hash for child in getChildren(node))
    hash            = if hashes.length then combineHashes(hashes) else {}
    hash[node.type] = if hash[node.type]? then hash[node.type] + 1 else 1
    return hash

  getNodeVector = (node) -> node.hash = computeHash(node)

  nodeWalk ast, getNodeVector, null, depth
  return ast.hash


module.exports =
  getChildren:  getChildren
  nodeWalk:     nodeWalk
  getNodeTypes: getNodeTypes

