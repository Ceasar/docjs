fs    = require 'fs'
_     = require 'lodash'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'

fs.readFile 'examples/cucumber.js', 'utf8', (err, jsFile) ->
  if err then return console.log err

  ast = acorn.parse(jsFile)
  stringifiedAST = JSON.stringify(ast, null, 4)
  console.log stringifiedAST

  body = ast.body

  collected =
    ExpressionStatement: []
    IfStatement: []
    WhileStatement: []
    ForStatement: []
    VariableDeclaration: []
    FunctionDeclaration: []
    ObjectExpression: []
    FunctionExpression: []
    NewExpression: []

  registerNode = (type) -> (node, state) -> collected[type].push node

  visitors =
    Node: (node, state) -> null
    Program: (node, state) -> null
    Statement: (node, state) -> null
    Expression: (node, state) -> null

  for k, v of collected
    visitors[k] = registerNode(k)

  console.log visitors

  walk.simple(body, visitors)
  console.log collected

