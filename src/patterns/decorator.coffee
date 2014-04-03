###

Finds the decorators in a Javascript program.

Usage:

  node decorators.coffee <filename>

###
_           = require 'lodash'
fs          = require 'fs'
acorn       = require 'acorn'
CodeCatalog = require('../code-catalog').CodeCatalog


getAbstractSyntaxTree = (jsFile) ->
  return acorn.parse(jsFile)


readFile = (filename, cb) ->
  fs.readFile filename, 'utf8', (err, jsFile) ->
    if err then console.log err else cb jsFile


decorators = new CodeCatalog()

findDecorators = (ast) ->
  for node in ast.body
    if node.expression?
      expression = node.expression
      if expression.left?
        name = expression.left.name
        if expression.right.arguments?
          if name in _.pluck(expression.right.arguments, 'name')
            decorators.add name, expression
  return decorators.toJSON()


main = (filename) ->
  readFile filename, (jsFile) ->
    ast = getAbstractSyntaxTree jsFile
    console.log findDecorators(ast)


if (require.main is module)
  filename = process.argv[2]
  main(filename)

module.exports =
  findDecorators: findDecorators
