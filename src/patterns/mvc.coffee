fs    = require 'fs'
_     = require 'lodash'
RSVP  = require 'rsvp'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'

{q}         = require '../utils'
astUtils    = require '../ast'
CodeCatalog = require('../code-catalog').CodeCatalog
NODE_TYPES  = require('../types').types
nullFn = () -> null

# -----------------------------------------------------------------------------

findMVCDefinitions = (ast) ->
  # generic mvc definitions
  backboneDefinitions = new CodeCatalog()
  findBackboneDefinitions(ast, backboneDefinitions)
  emberDefinitions = new CodeCatalog()
  findEmberDefinitions(ast, emberDefinitions)
  angularDefinitions = new CodeCatalog()
  findEmberDefinitions(ast, angularDefinitions)



findBackboneDefinitions = (ast, backboneDefinitions) ->

  modelDefs = new CodeCatalog()
  viewDefs = new CodeCatalog()
  collectionDefs = new CodeCatalog()

  # First pass: Run through all function definitions, i
  astUtils.nodeWalk(ast, nullFn, {
    # if its var M = Backbone.Model.extend....
    VariableDeclarator: (node) ->
      if (right = node.init) and right.type == 'CallExpression'
        # grab the name of the model
        name = node.id.name

        # inside the call expression
        if (right.callee.property?.name == 'extend') and (callee = right.callee.object) and
            callee.type == 'MemberExpression' and callee.object.name == 'Backbone' and
            callee.property.type == 'Identifier'
          switch callee.property.name
            when 'Model'
              model = new CodeCatalog()
              # add the attributes to the model
              console.log ('found a model!')
              modelDefs.add(name, model)
            when 'View'
              console.log ('found a view!')
              viewDefs.add(name, right)
            when 'Collection'
              console.log ('found a collection!')
              collectionDefs.add(name, right)

    # if its M = Backbonde.Model.extend... or exports.M = Backbone...
    AssignmentExpression: (node) ->
      name = undefined
      if (right = node.right) and right.type == 'CallExpression'
          # grab the name of the model
          # if it's a exports.xxx, then it's a member expression
          if node.left.type == 'MemberExpression' and node.left.object.name == 'exports'
            name = node.left.property.name
          else if node.left.type == 'hi'
            console.log 'hi'

        # inside the call expression
        if (right.callee.property?.name == 'extend') and (callee = right.callee.object) and
            callee.type == 'MemberExpression' and callee.object.name == 'Backbone' and
            callee.property.type == 'Identifier'
          switch callee.property.name
            when 'Model'
              console.log ('found a model!')
              modelDefs.add(name, right)
            when 'View'
              console.log ('found a view!')
              viewDefs.add(name, right)
            when 'Collection'
              console.log ('found a collection!')
              collectionDefs.add(name, right)
  })

findEmberDefinitions = (ast, emberDefinitions) ->

findAngularDefinitions = (ast, angularDefinitions) ->


module.exports =
  findMVC: findMVCDefinitions

