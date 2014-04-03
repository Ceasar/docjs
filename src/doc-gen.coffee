_     = require 'lodash'
fs    = require 'fs'
acorn = require 'acorn'

{q}   = require './utils'

findDecorators  = require('./patterns/decorator').findDecorators
findClasses     = require('./patterns/class').findClasses

# -----------------------------------------------------------------------------

getAbstractSyntaxTree = _.partialRight acorn.parse, { locations: true }

main = (filename) ->
  q(fs.readFile, filename, 'utf8')
    .then(getAbstractSyntaxTree)
    .then (ast) ->
      decorators  = findDecorators(ast)
      classes     = findClasses(ast)

      console.log '*** decorators ***'
      console.log(decorators)
      console.log '*** classes ***'
      console.log(classes)

if module is require.main
  filename = process.argv[2]
  main filename

