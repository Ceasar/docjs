_     = require 'lodash'
fs    = require 'fs'
RSVP  = require 'rsvp'
acorn = require 'acorn'

{q}             = require './utils'
findDecorators  = require('./patterns/decorator').findDecorators
findClasses     = require('./patterns/class').findClasses
findSingletons  = require('./patterns/singleton').findSingletons
findModules     = require('./patterns/module').findModules
config          = require('./doc-gen-config')
pprint          = require('./pprint')

# -----------------------------------------------------------------------------
# Helpers

# Returns a FUNCTION that takes a string of file contents and parses it into a
# Mozilla Parser API-compatible AST data structure.
getAbstractSyntaxTree = (fileName) ->
  _.partialRight(acorn.parse, {
    locations:  true
    sourceFile: fileName
  })

# -----------------------------------------------------------------------------

documentation = {}


documentPatterns = (fileName) -> (ast) ->
  console.info "*** Running file #{fileName} ***"

  # TODO: add more patterns?
  classes     = findClasses(ast)
  decorators  = findDecorators(ast)
  singletons  = undefined # findSingletons(ast)
  modules     = undefined # findModules(ast)

  # Exit if no patterns were found.
  return if _.every([classes, decorators, singletons, modules], _.isEmpty)

  doc = documentation[fileName] = {} unless documentation.fileName?
  doc.catalogs = _.reject([classes, decorators, singletons, modules], _.isEmpty)

# Run various pattern-matching modules on one file.
runFileAnalysis = (fileName) ->
  q(fs.readFile, fileName, 'utf8')
    .then(getAbstractSyntaxTree fileName)
    .then(documentPatterns fileName)

# Run various pattern-matching modules on all files (& recursively within all
# sub-folders) in one folder.
runDirectoryAnalysis = (dirname) ->

  filterfileNames = (fname) ->
    # don't look at hidden files
    return not fname.match(/^\./)

  runAnalysis = (fname) ->
    filepath = "#{dirname}/#{fname}"

    q(fs.stat, filepath).then (fstats) ->
      if fstats.isDirectory()
        runDirectoryAnalysis(filepath)
      else if fname.match /\.js$/
        runFileAnalysis(filepath)

  q(fs.readdir, dirname)
    .then(_.partialRight _.filter, filterfileNames)
    .then(_.partialRight _.map, runAnalysis)
    .then(RSVP.all)

# -----------------------------------------------------------------------------
# Main execution

main = () ->
  config.getPromise().then((config) ->
    analyses =
      (runFileAnalysis(file) for file in config.files)
        .concat(runDirectoryAnalysis(dir) for dir in config.directories)

    RSVP.all(analyses)

  ).then(() ->

    console.log(documentation)

  ).catch(console.error)

# -----------------------------------------------------------------------------

module.exports =
  main: main

main() if module is require.main

