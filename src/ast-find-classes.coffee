fs      = require 'fs'
_       = require 'lodash'
esprima = require 'esprima'

fs.readFile 'analysis/targets/cucumber.js', 'utf8', (err, jsFile) ->
  if err then return console.log err

  ast = esprima.parse(jsFile)
  stringifiedAST = JSON.stringify(ast, null, 4)

  body = ast.body
  classes = {}

  # Identify classes declared at the top level
  for expr in body
    if expr.type is esprima.Syntax.VariableDeclaration and \
        expr.declarations.length is 1

      # Scan for IIFF
      decl = expr.declarations[0]
      if decl.init.type is esprima.Syntax.CallExpression and \
          decl.init.callee.type is esprima.Syntax.FunctionExpression and \
          decl.init.callee.id is null and \
          decl.init.callee.body.type is esprima.Syntax.BlockStatement

        classes[decl.id.name] = decl.init

  console.log(classes)
