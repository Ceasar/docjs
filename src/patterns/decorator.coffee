###

Finds the decorators in a Javascript program.

###
_           = require 'lodash'
fs          = require 'fs'
acorn       = require 'acorn'
CodeCatalog = require('../code-catalog').CodeCatalog


findDecorators = (ast) ->
  decorators = new CodeCatalog("decorators")

  for node in ast.body
    if node.expression?
      expression = node.expression
      if expression.left?
        name = expression.left.name
        if expression.right.arguments?
          if name in _.pluck(expression.right.arguments, 'name')
            decorators.addPointer name, expression.loc
  return decorators

module.exports =
  findDecorators: findDecorators
