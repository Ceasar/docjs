_ = require 'lodash'
###
Utilities for working with the abstract syntax tree
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

# A generic function to walk the AST
# @param node An AST node
# @param fn A callback, called on every child of the root node
# @param fnMap A map of AST types to functions called on each of those types
nodeWalk = (node, fn, fnMap) ->
  for child in getChildren(node)
    nodeWalk(child, fn, fnMap)

  fnMap[node.type](node) if fnMap?[node.type]?
  fn(node) if fn?

module.exports = {
  getChildren: getChildren
  nodeWalk: nodeWalk
}
