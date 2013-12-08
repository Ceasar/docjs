###
#
# Simplify the given AST to a subset of javascript.
#
# List of Nodes:
# - Program
# - Function
#
# - Statements
# -- Empty
# -- Block
# -- Expression
# -- If
# -- Labeled
# -- Break
# -- Continue
# -- With
# -- Switch
# -- Return
# -- Throw
# -- Try
# -- While
# -- do/while
# -- for
# -- for/in
# -- for/of
# -- let
# -- debugger
#
# - Declarations
# -- Function
# -- Variable
#
# - Expressions
# -- This
# -- Array
# -- Object
# -- Function
# -- Arrow (fat arrow) (mozilla)
# -- Sequence (commas)
# -- Unary (unary operator)
# -- binary operator
# -- assignment operator
# -- update (increment/decremenet)
# -- logical operator
# -- conditional (ternary)
# -- new
# -- function/method call
# -- member ****
#
# - Patterns (ignore, only in js 1.7)
#
# - Clauses
# -- Swich case
# -- catch + try
# -- comprehension
#
# - Miscellaneous
# -- identifier
# -- literal
# -- unary operator
# -- binary operator
# -- logical operator
# -- assignment operator
# -- update operator
#
# - E4X (ignore)
# - XML (ignore)
#
#
###

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

