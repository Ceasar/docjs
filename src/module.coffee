###
Attempting to identify module pattern
###

acorn = require 'acorn'
fs = require 'fs'
{all} = require 'rsvp'

{nodeWalk} = require './ast'
{q} = require './utils'


# Return whether the node is an immediately-invoked function expression (IIFE)
isIIFE = (node) ->
  node.type == 'CallExpression' && node.callee?.type == 'FunctionExpression'


moduleDir = 'analysis/examples/modules'

asts = fs.readdirSync(moduleDir).map (file) ->
  acorn.parse(fs.readFileSync(moduleDir+'/'+file, 'utf8'))

iifes = []

for ast in asts
  nodeWalk ast, (node) ->
    if isIIFE(node)
      iifes.push(node)
