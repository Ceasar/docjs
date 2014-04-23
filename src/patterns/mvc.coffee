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
  findAngularDefinitions(ast, angularDefs)

  mvcDefinitions = new CodeCatalog()
  mvcDefinitions.add('backbone', backboneDefs.toJSON())
  mvcDefinitions.add('ember', emberDefs.toJSON())
  mvcDefinitions.add('angular', angularDefs.toJSON())
  console.log mvcDefinitions.toJSON()

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
        # walk the left node - for each memberExpression, if its property is a "Identifier", set name to it
        astUtils.nodeWalk(node.left, nullFn, {
          Identifier: (node) ->
              name = node.name
        })
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


findEmberDefinitions = (ast, emberComponents) ->
  # App
  # Controllers
  # Handlebars helpers
  # DS.Model
  # Router
  #
  controllers = new CodeCatalog()
  array_controllers = new CodeCatalog()
  object_controllers = new CodeCatalog()

  ## find the app
  astUtils.nodeWalk(ast, nullFn, {
      # if its var M = Backbone.Model.extend....
      VariableDeclarator: (node) ->
        console.log 'variable declarator'
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
                ember_temp = new CodeCatalog()
                ember_temp.add('Application', right)
                emberComponents.add(name, ember_temp.toJSON())

      AssignmentExpression: (node) ->
        console.log 'assignment expression'
        # console.log node.right
        name = undefined
        ###
        # Check for Ember.Application.create
        ###
        if (right = node.right) and right.type == 'CallExpression'
          # grab the name of the model
          # if it's a exports.xxx, then it's a member expression
          if node.left.type == 'MemberExpression' and node.left.object.name == 'exports'
            name = node.left.property?.name

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

            if name?
              # if emberComponents already contains the name, then add it to it
              if emberComponents.has(name)
                emberComponents.add('Application', right)
              else
                ember_temp = new CodeCatalog()
                ember_temp.add('Application', right)
                emberComponents.add(name, ember_temp.toJSON())
        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        # console.log node.right
        if node.right.callee?.object?.object?.name == 'Ember' and
          (controller_type = node.right.callee?.object?.property.name) and
          (controller_type == 'ArrayController' or controller_type == 'ObjectController') and
          node.right?.callee?.property?.name == 'extend'
            # we found an array or object controller
            console.log 'found an ember controller'
            name = node.left
            # walk the left node - for each memberExpression, if its property is a "Identifier", set name to it
            astUtils.nodeWalk(node.left, nullFn, {
              Identifier: (node) ->
                  name = node.name
            })
            if controller_type == 'ArrayController'
              array_controllers.add(name, node.right)
            else
              object_controllers.add(name, node.right)
      # console.log node.right.callee.object


      # MemberExpression: (node) ->
      #   console.log 'member expression'
      # console.log node
      # console.log node.object.name
      CallExpression: (node) ->
        # detect Ember Router
        console.log 'call expression'
        name = undefined
        if node.property?.name == 'map' and node.callee?.property.name == 'Router'
          name = node.callee.object.name
          emberComponents.add('Router', node)
    })

  # add all controllers
  controllers.add('ArrayControllers', array_controllers.toJSON())
  controllers.add('ObjectControllers', object_controllers.toJSON())
  emberComponents.add('Controllers', controllers.toJSON())

  return emberComponents





findAngularDefinitions = (ast, angularDefs) ->


module.exports =
  findMVC: findMVCDefinitions

