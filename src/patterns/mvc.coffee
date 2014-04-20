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
  backboneDefs = new CodeCatalog()
  findBackboneDefinitions(ast, backboneDefs)
  emberDefs = new CodeCatalog()
  findEmberDefinitions(ast, emberDefs)
  angularDefs = new CodeCatalog()
  findEmberDefinitions(ast, angularDefs)

  mvcDefinitions = new CodeCatalog()
  mvcDefinitions.add('backbone', backboneDefs.toJSON())
  mvcDefinitions.add('ember', emberDefs.toJSON())
  mvcDefinitions.add('angular', angularDefs.toJSON())

  return mvcDefinitions.toJSON()





findBackboneDefinitions = (ast, backboneDefs) ->

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
  backboneDefs.add('models', modelDefs.toJSON())
  backboneDefs.add('views', viewDefs.toJSON())
  backboneDefs.add('collections', collectionDefs.toJSON())
  return backboneDefs


findEmberDefinitions = (ast, emberDefs) ->
  # App
  # Controllers
  # Handlebars helpers
  # DS.Model
  # Router
  #
  emberComponents = new CodeCatalog()


  ## find the app
  astUtils.nodeWalk(ast, nullFn, {
      # if its var M = Backbone.Model.extend....
      VariableDeclarator: (node) ->
        name = undefined
        ###
        # Check for Ember.Application.create
        ###
        if (right = node.init) and right.type == 'CallExpression'

          # console.log right?.callee?.object?.name
          if right?.callee?.object?.object?.name == 'Ember' and
              right?.callee?.object?.property?.name == 'Application' and
              right?.callee?.property?.name == 'create'
            # this is an ember Application object. grab the name
            name = node.id.name
            console.log name

            if name?
              # if emberComponents already contains the name, then add it to it
              if emberComponents.has(name)
                emberComponents.add('Application', right)
              else
                emberComponents.add(name, new CodeCatalog)
                emberComponents.get(name).add('Application', right)

      AssignmentExpression: (node) ->
        name = undefined
        ###
        # Check for Ember.Application.create
        ###
        if (right = node.right) and right.type == 'CallExpression'
          # grab the name of the model
          # if it's a exports.xxx, then it's a member expression
          if node.left.type == 'MemberExpression' and node.left.object.name == 'exports'
            name = node.left.property.name
          else if node.left.type == 'hi'
            console.log 'hi'

          # console.log right?.callee?.object?.name
          if right?.callee?.object?.object?.name == 'Ember' and
              right?.callee?.object?.property?.name == 'Application' and
              right?.callee?.property?.name == 'create'
            # this is an ember Application object. traverse node.left for the final thingie's name
            # console.log node.left
            # walk the left node - for each memberExpression, if its property is a "Identifier", set name to it
            astUtils.nodeWalk(node.left, nullFn, {
              Identifier: (node) ->
                  name = node.name
            })
            console.log name

            if name?
              # if emberComponents already contains the name, then add it to it
              if emberComponents.has(name)
                emberComponents.add('Application', right)
              else
                emberComponents.add(name, new CodeCatalog)
                emberComponents.get(name).add('Application', right)
    })



  # Router




findAngularDefinitions = (ast, angularDefs) ->


module.exports =
  findMVC: findMVCDefinitions

