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
  models = new CodeCatalog()
  views = new CodeCatalog()
  checkbox_views = new CodeCatalog()
  textfield_views = new CodeCatalog()
  select_views = new CodeCatalog()
  textarea_views = new CodeCatalog()
  view_views = new CodeCatalog()

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

        if right.callee?.object?.object?.name == 'Ember' and
          (controller_type = right.callee?.object?.property.name) and
          (controller_type == 'ArrayController' or controller_type == 'ObjectController') and
          right?.callee?.property?.name == 'extend'
            # we found an array or object controller
            name = node.id.name
            if controller_type == 'ArrayController'
              array_controllers.add(name, node.right)
            else
              object_controllers.add(name, node.right)

        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        if right.callee?.object?.object?.name == 'DS' and
          (right.callee?.object?.property.name == 'Model') and
          right?.callee?.property?.name == 'extend'
            # we found an array or object controller
            name = node.id.name
            models.add(name, right)

        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        if right.callee?.object?.object?.name == 'Ember' and
          (view_type = right.callee?.object?.property.name) and
          (view_type == 'Checkbox' or view_type == 'TextField' or
           view_type == "Select" or view_type == 'TextArea' or view_type == 'View')
            # we found a view
            # walk the left node - for each memberExpression, if its property is a "Identifier", set name to it
            name = node.id.name

            switch view_type
              when 'Checkbox'
                checkbox_views.add(name, node.right)
              when 'TextField'
                textfield_views.add(name, node.right)
              when 'TextArea'
                textarea_views.add(name, node.right)
              when 'Select'
                select_views.add(name, node.right)
              when 'View'
                view_views.add(name, node.right)


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

        if node.right.callee?.object?.object?.name == 'Ember' and
          (controller_type = node.right.callee?.object?.property.name) and
          (controller_type == 'ArrayController' or controller_type == 'ObjectController') and
          node.right?.callee?.property?.name == 'extend'
            # we found an array or object controller
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

        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        if node.right.callee?.object?.object?.name == 'DS' and
          (node.right.callee?.object?.property.name == 'Model') and
          node.right?.callee?.property?.name == 'extend'
            # we found an array or object controller
            name = node.left
            # walk the left node - for each memberExpression, if its property is a "Identifier", set name to it
            astUtils.nodeWalk(node.left, nullFn, {
              Identifier: (node) ->
                  name = node.name
            })
            models.add(name, node.right)

        ###
        # Check for Ember.ObjectController/ArrayController.extend
        ###

        if right.callee?.object?.object?.name == 'Ember' and
          (view_type = right.callee?.object?.property.name) and
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
                checkbox_views.add(name, node.right)
              when 'TextField'
                textfield_views.add(name, node.right)
              when 'TextArea'
                textarea_views.add(name, node.right)
              when 'Select'
                select_views.add(name, node.right)
              when 'View'
                view_views.add(name, node.right)

      CallExpression: (node) ->
        # detect Ember Router
        name = undefined
        if node.property?.name == 'map' and node.callee?.property.name == 'Router'
          name = node.callee.object.name
          emberComponents.add('Router', node)
    })

  # add all controllers
  controllers.add('ArrayControllers', array_controllers.toJSON())
  controllers.add('ObjectControllers', object_controllers.toJSON())
  views.add('CheckboxViews', checkbox_views.toJSON())
  views.add('TextFieldViews', textfield_views.toJSON())
  views.add('TextAreaView', textarea_views.toJSON())
  views.add('SelectView', select_views.toJSON())
  views.add('ViewViews', view_views.toJSON())
  emberComponents.add('Models', models.toJSON())
  emberComponents.add('Views', views.toJSON())
  emberComponents.add('Controllers', controllers.toJSON())

  return emberComponents





findAngularDefinitions = (ast, angularDefs) ->


module.exports =
  findMVC: findMVCDefinitions

