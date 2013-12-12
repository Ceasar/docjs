###
#
# Simplify the given AST to a subset of javascript.
#
# List of Nodes:
# - Program
# - Function
#
# - Statements
# -- Empty - keep
# -- Block - keep
# -- Expression - keep
# -- If - keep
# -- Labeled - not entirely sure what this is
# -- Break - keep
# -- Continue - keep
# -- With - how to REPLACE?
# -- Switch - REPLACE with if/else
# -- Return - keep
# -- Throw - keep
# -- Try - keep
# -- While - REPLACE with for
# -- do/while - REPLACE with for
# -- for- keep
# -- for/in - REPLACE with for?
# -- for/of - ignore? what is this..
# -- debugger - ignore
#
# - Declarations
# -- Function - keep
# -- Variable - keep
#
# - Expressions
# -- This - keep
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


###
#
# Input AST:
# for(var i=0; i < 10; i++)
#   sum++;
#
# Output AST:
# var i=0;
# while(i < 10) {
#   sum++;
#   i++;
# }
#
#
#
###
convertSwitchToIf = (node, index, obj) ->
  parent_if = last_if = {}  # array of if else if nodes
  for switchCase, i in node.cases

    # check the default case.
    unless if_node.test.right == 'default'
      if_node =
        type: 'IfStatement'
        start: switchCase.start
        end: switchCase.end
        test:
          type: 'BinaryExpression'  # always check as ===
          start: 0
          end: 0    # TODO: how to determine start and end?
          left: node.discriminant
          operator: '==='
          right: switchCase.test
          consequent: switchCase.consequent
    else
      if_node =
        type: 'BlockStatement'
        start: switchCase.start
        end: switchCase.end
        body: consequent

    if i == 0 then parent_if = if_node else parent_if.alternate = if_node
    last_if = if_node


convertForToWhile = (node, index, obj) ->
    # build while statement
    while_node =
      type: "WhileStatement"
      start: node.start
      end: node.end
      test: test
      body: body
    # append the update to the end of the body
    while_node.body.body.push node.update
    # append the init into obj.body before the while node.
    obj.body.slice index, 0, node.init

rebuildAST = (stringifiedAST) ->
  obj = JSON.parse(stringifiedAST)
  for node, index in obj.body
    # console.log key, value
    if node.type == 'ForStatement'
      convertForToWhile node, index, obj
    if node.type == 'SwitchStatement'
      convertSwitchToIf node, index, obj


fs.readFile 'examples/subset/switch.js', 'utf8', (err, jsFile) ->
  if err then return console.log err

  ast = acorn.parse(jsFile)
  stringifiedAST = JSON.stringify(ast, null, 4)
  # console.log stringifiedAST
  # write out into file for inspection purposes;
  fs.writeFile 'examples/subset/out/out.js', stringifiedAST, (err) ->
    if err then throw err
    else console.log 'Saved!'

  # run over ast,
  # rebuildAST stringifiedAST

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

  # walk.simple(body, visitors)
  # console.log collected

