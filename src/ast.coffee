###
# Utilities for working with the abstract syntax tree
###

_ = require 'lodash'

# List of all the possible JavaScript AST node types, as defined by the
# Mozilla Parser API
exports.TYPES = TYPES = [
  "Node"
  "Program"
  "Function"
  "Statement"
  "EmptyStatement"
  "BlockStatement"
  "ExpressionStatement"
  "IfStatement"
  "LabeledStatement"
  "BreakStatement"
  "ContinueStatement"
  "WithStatement"
  "SwitchStatement"
  "ReturnStatement"
  "ThrowStatement"
  "TryStatement"
  "WhileStatement"
  "DoWhileStatement"
  "ForStatement"
  "ForInStatement"
  "ForOfStatement"
  "LetStatement"
  "DebuggerStatement"
  "Declaration"
  "FunctionDeclaration"
  "VariableDeclaration"
  "VariableDeclarator"
  "Expression"
  "ThisExpression"
  "ArrayExpression"
  "ObjectExpression"
  "FunctionExpression"
  "ArrowExpression"
  "SequenceExpression"
  "UnaryExpression"
  "BinaryExpression"
  "AssignmentExpression"
  "UpdateExpression"
  "LogicalExpression"
  "ConditionalExpression"
  "NewExpression"
  "CallExpression"
  "MemberExpression"
  "YieldExpression"
  "ComprehensionExpression"
  "GeneratorExpression"
  "GraphExpression"
  "GraphIndexExpression"
  "LetExpression"
  "Pattern"
  "ObjectPattern"
  "ArrayPattern"
  "SwitchCase"
  "CatchClause"
  "ComprehensionBlock"
  "Identifier"
  "Literal"
]

typeTree =
  Node: null
  Program: 'Node'
  Function: 'Node'
  Statement: 'Node'
  EmptyStatement: 'Statement'
  BlockStatement: 'Statement'
  ExpressionStatement: 'Statement'
  IfStatement: 'Statement'
  LabeledStatement: 'Statement'
  BreakStatement: 'Statement'
  ContinueStatement: 'Statement'
  WithStatement: 'Statement'
  SwitchStatement: 'Statement'
  ReturnStatement: 'Statement'
  ThrowStatement: 'Statement'
  TryStatement: 'Statement'
  WhileStatement: 'Statement'
  DoWhileStatement: 'Statement'
  ForStatement: 'Statement'
  ForInStatement: 'Statement'
  ForOfStatement: 'Statement'
  LetStatement: 'Statement'
  DebuggerStatement: 'Statement'
  Declaration: 'Statement'
  FunctionDeclaration: ['Function', 'Declaration']
  VariableDeclaration: 'Declaration'
  VariableDeclarator: 'Node'
  Expression: ['Node', 'Pattern']
  ThisExpression: 'Expression'
  ArrayExpression: 'Expression'
  ObjectExpression: 'Expression'
  FunctionExpression: ['Function', 'Expression']
  ArrowExpression: ['Function', 'Expression']
  SequenceExpression: 'Expression'
  UnaryExpression: 'Expression'
  BinaryExpression: 'Expression'
  AssignmentExpression: 'Expression'
  UpdateExpression: 'Expression'
  LogicalExpression: 'Expression'
  ConditionalExpression: 'Expression'
  NewExpression: 'Expression'
  CallExpression: 'Expression'
  MemberExpression: 'Expression'
  YieldExpression: 'Expression'
  ComprehensionExpression: 'Expression'
  GeneratorExpression: 'Expression'
  GraphExpression: 'Expression'
  GraphIndexExpression: 'Expression'
  LetExpression: 'Expression'
  Pattern: 'Node'
  ObjectPattern: 'Pattern'
  ArrayPattern: 'Pattern'
  SwitchCase: 'Pattern'
  CatchClause: 'Node'
  ComprehensionBlock: 'Node'
  Identifier: ['Node', 'Expression', 'Pattern']
  Literal: ['Node', 'Expression']

# -----------------------------------------------------------------------------

ty = {}
for type in TYPES
  ty['is'+type] = exports['is'+type] = do (type) ->
    return (node) -> node?.type is type

# Given an AST node, return a list of its immediate children
exports.getChildren = getChildren = (node) ->
  children = []

  # Check all properties for nodes or node arrays
  for own k, v of node
    if v?.type?
      children.push(v)
    else if Array.isArray(v) and v.length
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
# @param node An AST node
# @param fn A callback, called on every child of the root node
# @param fnMap A map of AST types to functions called on each of those types
###
exports.nodeWalk = nodeWalk = (node, fn, fnMap) ->
  for child in getChildren(node)
    nodeWalk(child, fn, fnMap)

  fnMap[node.type](node) if fnMap?[node.type]?
  fn(node) if fn?

###
# Given a node with location information and a source file, return the string
# of source code corresponding to the node
###
exports.getNodeSrc = getNodeSrc = (node, src) ->
  {start, end} = node.loc

  # TODO too naive?
  lines = src.split('\n')
  return lines.slice(start.line - 1, end.line).join('\n')

# -----------------------------------------------------------------------------

# Return whether the node is an immediately-invoked function expression (IIFE)
exports.isIIFE = (node) ->
  exports.isCallExpression(node) and exports.isFunctionExpression(node.callee)

