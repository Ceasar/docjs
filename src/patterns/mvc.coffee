fs    = require 'fs'
_     = require 'lodash'
RSVP  = require 'rsvp'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'

{q}         = require '../utils'
astUtils    = require '../ast'
CodeCatalog = require('../code-catalog').CodeCatalog
MVCPattern = require('../code-catalog').MVCPattern
nullFn = () -> null

# -----------------------------------------------------------------------------

findMVCDefinitions = (ast) ->
  mvc = new MVCPattern()
  # generic mvc definitions
  backboneDefs = mvc.getCatalog('Backbone')
  # findBackboneDefinitions(ast, backboneDefs)
  emberDefs = mvc.getCatalog('Ember')
  findEmberDefinitions(ast, emberDefs)

  return mvc


findBackboneDefinitions = (ast, backbone) ->

  modelDefs = backbone.getCatalog('models')
  viewDefs = backbone.getCatalog('views')
  collectionDefs = backbone.getCatalog('collections')

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
              # add the attributes to the model
              modelDefs.addPointer(name, right.loc)
            when 'View'
              viewDefs.addPointer(name, right.loc)
            when 'Collection'
              collectionDefs.addPointer(name, right.loc)


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
              modelDefs.addPointer(name, right.loc)
            when 'View'
              viewDefs.addPointer(name, right.loc)
            when 'Collection'
              collectionDefs.addPointer(name, right.loc)
  })
  return backbone


findEmberDefinitions = (ast, ember) ->
  # App
  # Controllers
  # Handlebars helpers
  # DS.Model
  # Router


  application = ember.getCatalog('application')
  router = ember.getCatalog('router')
  controllers = ember.getCatalog('controllers')
  array_controllers = controllers.addCatalog('array_controllers')
  object_controllers = controllers.addCatalog('object_controllers')
  models = ember.getCatalog('models')
  views = ember.getCatalog('views')
  checkbox_views = views.addCatalog('checkbox')
  textfield_views = views.addCatalog('textfield')
  select_views = views.addCatalog('select')
  textarea_views = views.addCatalog('textarea')
  view_views = views.addCatalog('view')

  ## find the app
  astUtils.nodeWalk(ast, nullFn, {
      # if its var M = Backbone.Model.extend....
      VariableDeclarator: (node) ->
        name = undefined
        ###
        # Check for Ember.Application.create
        ###
        if (right = node.init) and right.type == 'CallExpression'

          if right?.callee?.object?.object?.name == 'Ember' and
              right?.callee?.object?.property?.name == 'Application' and
              right?.callee?.property?.name == 'create'
            # this is an ember Application object. grab the name
            name = node.id.name

            # if name?
            #   # if ember already contains the name, then add it to it
            #   if ember.has(name)
            #     ember.addCatalog('Application', right)
            #   else
            application.addPointer(name, right.loc)

        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        if right?.callee?.object?.object?.name == 'Ember' and
          (controller_type = right?.callee?.object?.property.name) and
          (controller_type == 'ArrayController' or controller_type == 'ObjectController') and
          right?.callee?.property?.name == 'extend'
            # we found an array or object controller
            name = node.id.name
            if controller_type == 'ArrayController'
              array_controllers.addPointer(name, node.right.loc)
            else
              object_controllers.addPointer(name, node.right.loc)

        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        if right?.callee?.object?.object?.name == 'DS' and
          (right?.callee?.object?.property.name == 'Model') and
          right?.callee?.property?.name == 'extend'
            # we found an array or object controller
            name = node.id.name
            models.addPointer(name, right.loc)

        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        if right?.callee?.object?.object?.name == 'Ember' and
          (view_type = right?.callee?.object?.property.name) and
          (view_type == 'Checkbox' or view_type == 'TextField' or
           view_type == "Select" or view_type == 'TextArea' or view_type == 'View')
            # we found a view
            # walk the left node - for each memberExpression, if its property is a "Identifier", set name to it
            name = node.id.name

            switch view_type
              when 'Checkbox'
                checkbox_views.addPointer(name, node.right.loc)
              when 'TextField'
                textfield_views.addPointer(name, node.right.loc)
              when 'TextArea'
                textarea_views.addPointer(name, node.right.loc)
              when 'Select'
                select_views.addPointer(name, node.right.loc)
              when 'View'
                view_views.addPointer(name, node.right.loc)


      AssignmentExpression: (node) ->
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
            # walk the left node - for each memberExpression, if its property is a "Identifier", set name to it
            astUtils.nodeWalk(node.left, nullFn, {
              Identifier: (node) ->
                  name = node.name
            })

            # if name?
            #   # if ember already contains the name, then add it to it
            #   if ember.has(name)
            #     ember.addCatalog('Application', right)
            #   else
            application.addPointer(name, right.loc)

        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        if right?.callee?.object?.object?.name == 'Ember' and
          (controller_type = right?.callee?.object?.property.name) and
          (controller_type == 'ArrayController' or controller_type == 'ObjectController') and
          right?.callee?.property?.name == 'extend'
            # we found an array or object controller
            name = node.left
            # walk the left node - for each memberExpression, if its property is a "Identifier", set name to it
            astUtils.nodeWalk(node.left, nullFn, {
              Identifier: (node) ->
                  name = node.name
            })
            if controller_type == 'ArrayController'
              array_controllers.addPointer(name, node.right.loc)
            else
              object_controllers.addPointer(name, node.right.loc)

        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        if right?.callee?.object?.object?.name == 'DS' and
          (right?.callee?.object?.property.name == 'Model') and
          node.right?.callee?.property?.name == 'extend'
            # we found an array or object controller
            name = node.left
            # walk the left node - for each memberExpression, if its property is a "Identifier", set name to it
            astUtils.nodeWalk(node.left, nullFn, {
              Identifier: (node) ->
                  name = node.name
            })
            models.addPointer(name, node.right.loc)

        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        if right?.callee?.object?.object?.name == 'Ember' and
          (view_type = right?.callee?.object?.property.name) and
          (view_type == 'Checkbox' or view_type == 'TextField' or
           view_type == "Select" or view_type == 'TextArea' or view_type == 'View')
            # we found a view
            # walk the left node - for each memberExpression, if its property is a "Identifier", set name to it
            astUtils.nodeWalk(node.left, nullFn, {
              Identifier: (node) ->
                  name = node.name
            })

            switch view_type
              when 'Checkbox'
                checkbox_views.addPointer(name, node.right.loc)
              when 'TextField'
                textfield_views.addPointer(name, node.right.loc)
              when 'TextArea'
                textarea_views.addPointer(name, node.right.loc)
              when 'Select'
                select_views.addPointer(name, node.right.loc)
              when 'View'
                view_views.addPointer(name, node.right.loc)

      CallExpression: (node) ->
        # detect Ember Router
        name = undefined
        if node.callee?.property?.name == 'map' and node.callee?.object?.name == 'Router'
          name = node.callee.object.name
          router.addPointer('name', node.loc)
    })

  return ember


findAngularDefinitions = (ast, angularDefs) ->


module.exports =
  findMVC: findMVCDefinitions

