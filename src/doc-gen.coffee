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


# Returns a FUNCTION that takes a string of file contents and parses it into a
# Mozilla Parser API-compatible AST data structure.
getAbstractSyntaxTree = (fileName) ->
  _.partialRight(acorn.parse, {
    locations:  true
    sourceFile: fileName
  })


# -----------------------------------------------------------------------------

documentation = {}


documentPatterns = (filename) -> (ast) ->
  # TODO: add more pattern matching
  classes     = findClasses(ast)
  decorators  = findDecorators(ast)
  singletons  = findSingletons(ast)
  modules     = findModules(ast)

  # Exit if no patterns were found.
  return if _.every([classes, decorators, singletons, modules], _.isEmpty)

  doc = documentation[filename] = {} unless documentation.filename?

  doc.classes     = classes     unless _.isEmpty(classes)
  doc.decorators  = decorators  unless _.isEmpty(decorators)
  doc.singletons  = singletons  unless _.isEmpty(singletons)
  doc.modules     = modules     unless _.isEmpty(modules)

# Run various pattern-matching modules on one file.
runFileAnalysis = (fileName) ->
  q(fs.readFile, fileName, 'utf8')
    .then(getAbstractSyntaxTree fileName)
    .then(documentPatterns fileName)

# Run various pattern-matching modules on all files (& recursively within all
# sub-folders) in one folder.
runDirectoryAnalysis = (dirname) ->

  filterFilenames = (fname) ->
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
    .then(_.partialRight _.filter, filterFilenames)
    .then(_.partialRight _.map, runAnalysis)
    .then(RSVP.all)

# -----------------------------------------------------------------------------

# Main execution
# TODO: pretty print the documentation

main = () ->
  config.getPromise().then((config) ->
    analyses =
      (runFileAnalysis(file) for file in config.files)
        .concat(runDirectoryAnalysis(dir) for dir in config.directories)

    RSVP.all(analyses)

  ).then(() ->

    console.log(documentation)

  ).catch(console.error)


main() if module is require.main

