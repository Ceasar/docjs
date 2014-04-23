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
  constructor: (@name, @pointers={}, @catalogs={}) ->

  addPointer: (name, loc) ->
    unless @hasPointer(name)
      @pointers[name] = new CodePointer(name, loc)

  deletePointer: (name) ->
    delete @pointers[name]

  hasPointer: (name) ->
    @pointers[name]?

  # getter / setter
  pointer: (name, p) ->
    return unless name?
    if p? then (@pointers[name] = p) else @pointers[name]

  # getter / setter
  catalog: (name, c) ->
    return unless name?
    if c? then (@catalogs[name] = c) else @catalogs[name]

# ----------------------------------------------------------------------------
# Extensions

###
The code catalog for a class
###
class ClassPattern extends CodeCatalog

  constructor: (@name) ->
    @catalogs =
      properties: new CodeCatalog 'properties'
      methods:    new CodeCatalog 'methods'

  addMethod: (name, loc) ->
    @catalogs.methods.addPointer(name, loc)

  addProperty: (name, loc) ->
    @catalogs.properties.addPointer(name, loc)

###
The code catalog for a module
###
class ModulePattern extends CodeCatalog


###
The code catalog for mvc
###
class MVCPattern extends CodeCatalog
  constructor: (@name) ->
    @ember = new CodeCatalog('Ember')

    @ember.addCatalog('models', new CodeCatalog('Models'))
    ember_views = new CodeCatalog('Views')
    ember_views.addCatalog('checkbox', new CodeCatalog('CheckboxViews'))
    ember_views.addCatalog('textfield', new CodeCatalog('TextFieldViews'))
    ember_views.addCatalog('textarea', new CodeCatalog('TextAreaViews'))
    ember_views.addCatalog('select', new CodeCatalog('SelectViews'))
    ember_views.addCatalog('view', new CodeCatalog('View'))
    @ember.addCatalog('views', ember_views)
    ember_controllers = new CodeCatalog('Controllers')
    ember_controllers.addCatalog('array_controllers', new CodeCatalog('ArrayController'))
    ember_controllers.addCatalog('object_controllers', new CodeCatalog('ObjectController'))
    @ember.addCatalog('controllers', ember_controllers)
    @ember.addCatalog('router', new CodeCatalog('Router'))
    @ember.addCatalog('application', new CodeCatalog('Application'))

    @backbone = new CodeCatalog('Backbone')

    @backbone.addCatalog('models', new CodeCatalog())
    @backbone.addCatalog('views', new CodeCatalog())
    @backbone.addCatalog('collections', new CodeCatalog())

  addCatalog: (name) ->
    @catalogs[name] = new CodeCatalog(name)

  getCatalog: (name) ->
    @catalogs[name]

  hasCatalog: (name) ->
    @catalogs[name]?



# ----------------------------------------------------------------------------

module.exports =
  CodeCatalog:    CodeCatalog
  ClassPattern:   ClassPattern
  ModulePattern:  ModulePattern
  MVCPattern:     MVCPattern

