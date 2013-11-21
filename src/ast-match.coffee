fs    = require 'fs'
_     = require 'lodash'
acorn = require 'acorn'

fs.readFile 'examples/cucumber.js', 'utf8', (err, jsFile) ->
  if err then return console.log err

  ast = acorn.parse(jsFile)
  stringifiedAST = JSON.stringify(ast, null, 4)

  body = ast.body

  for expr in body
    console.log expr

