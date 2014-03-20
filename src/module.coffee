###
Attempting to identify module pattern
###

acorn = require 'acorn'
fs    = require 'fs'
path  = require 'path'

{nodeWalk, getNodeSrc} = require './ast'
{q} = require './utils'


# Return whether the node is an immediately-invoked function expression (IIFE)
isIIFE = (node) ->
  node.type == 'CallExpression' && node.callee?.type == 'FunctionExpression'


moduleDir = 'analysis/examples/modules'

asts = fs.readdirSync(moduleDir).map (file) ->
  file = path.join(moduleDir, file)
  fileStr = fs.readFileSync(file, 'utf8')
  acorn.parse(fileStr, {locations: true, sourceFile: file})

iifes = []
srcs = []

for ast in asts
  nodeWalk ast, (node) ->
    if isIIFE(node)
      iifes.push(node)
      srcs.push(getNodeSrc(node, fs.readFileSync(node.loc.source, 'utf8')))
debugger
