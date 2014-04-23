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
    @pointers[name] = new CodePointer(name, loc)

  hasPointer: (name) ->
    @pointers[name]?

# ----------------------------------------------------------------------------
# Extensions

###
The code catalog for a class
###
class ClassPattern extends CodeCatalog


###
The code catalog for a module
###
class ModulePattern extends CodeCatalog


# ----------------------------------------------------------------------------

module.exports =
  CodeCatalog:    CodeCatalog
  ClassPattern:   ClassPattern
  ModulePattern:  ModulePattern

