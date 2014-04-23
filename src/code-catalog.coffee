# ----------------------------------------------------------------------------
# Base classes for CodeCatalog

class CodeLoc
  constructor: (@line, @column) ->


class CodeRange
  constructor: (@start=null, @end=null) ->


###
A pointer to a piece of code in a codebase
@property loc   {CodeRange} The location of the code in question
@property name  {string}    Name of the symbol
###
class CodePointer
  constructor: (@name, @loc) ->


###
A collection of code pointers
@property name      {string?} Name of this catalog (if applicable)
@property pointers  {Array<CodePointer>}
@property catalogs  {Array<CodeCatalog>}
###
class CodeCatalog
  constructor: (@name, @pointers={}, @catalogs=[]) ->

  addPointer: (name, loc) ->
    unless @hasPointer(name)
      @pointers[name] = new CodePointer(name, loc)

  deletePointer: (name) ->
    delete @pointers[name]

  getPointer: (name) ->
    @pointers[name]

  hasPointer: (name) ->
    @pointers[name]?

  # getter / setter
  pointer: (name, p) ->
    return unless name?
    if p? then (@pointers[name] = p) else @pointers[name]

  addCatalog: (name) ->
    @catalogs.push(new CodeCatalog(name))

  getCatalog: (name) ->
    for catalog in @catalogs
      if catalog.name is name then return catalog

  hasCatalog: (name) ->
    return true for catalog in @catalogs when catalog.name is name
    return false

# ----------------------------------------------------------------------------
# Extensions

class ClassPattern extends CodeCatalog

  constructor: (@name, @pointers={}, @catalogs=[]) ->
    @addCatalog('properties')
    @addCatalog('methods')
    @type = 'Class'

  addMethod: (name, loc) ->
    @getCatalog('methods').addPointer(name, loc)

  addProperty: (name, loc) ->
    @getCatalog('properties').addPointer(name, loc)

class ModulePattern extends CodeCatalog
  constructor: (@name, @pointers={}, @catalogs=[]) ->
    @type = 'Module'


class MVCPattern extends CodeCatalog
  constructor: (@name) ->
    ember = new CodeCatalog('Ember')

    ember_views = new CodeCatalog('Views')
    ember_views.addCatalog('Checkbox')
    ember_views.addCatalog('Textfield')
    ember_views.addCatalog('Textarea')
    ember_views.addCatalog('Select')
    ember_views.addCatalog('View')
    ember_controllers = new CodeCatalog('Controllers')
    ember_controllers.addCatalog('Array Controllers')
    ember_controllers.addCatalog('Object Controllers')

    ember.catalogs = [ember_views, ember_controllers]
    ember.addCatalog('Models')
    ember.addCatalog('Router')
    ember.addCatalog('Application')

    backbone = new CodeCatalog('Backbone')

    backbone.addCatalog('Models', new CodeCatalog())
    backbone.addCatalog('Views', new CodeCatalog())
    backbone.addCatalog('Collections', new CodeCatalog())

    @.catalogs = [ember, backbone]
    @type = 'MVC'


# ----------------------------------------------------------------------------

module.exports =
  CodeCatalog:    CodeCatalog
  ClassPattern:   ClassPattern
  ModulePattern:  ModulePattern
  MVCPattern:     MVCPattern

