class CodeLoc
  constructor: (@line, @column) ->


class CodeRange
  constructor: (@start=null, @end=null) ->


###
A pointer to a piece of code in a codebase
@property loc {CodeRange} The location of the code in question
@property name {string?} Name of the symbol if applicable (may be null)
###
exports.CodePointer = class CodePointer
  constructor: (@loc, @name=null) ->


###
A collection of code pointers
@property name {string?} Name of this catalog (if applicable)
@property pointers {Array<CodePointer>}
@property catalogs {Array<CodeCatalog>}
###
exports.CodeCatalog = class CodeCatalog
  constructor: (@name, @pointers=[], @catalogs=[]) ->


###
The code catalog for a class
###
exports.ClassPattern = class ClassPattern extends CodeCatalog


###
The code catalog for a module
###
exports.ModulePattern = class ModulePattern extends CodeCatalog
