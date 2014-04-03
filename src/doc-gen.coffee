_     = require 'lodash'
fs    = require 'fs'
RSVP  = require 'rsvp'
acorn = require 'acorn'

{q}             = require './utils'
findDecorators  = require('./patterns/decorator').findDecorators
findClasses     = require('./patterns/class').findClasses
config          = require('./doc-gen-config')


getAbstractSyntaxTree = _.partialRight acorn.parse, { locations: true }

# -----------------------------------------------------------------------------

documentation = {}


documentPatterns = (filename) -> (ast) ->
  # TODO: add more pattern matching
  classDefinitions  = findClasses(ast)
  decorators        = findDecorators(ast)
  return if _.isEmpty(classDefinitions) and _.isEmpty(decorators)

  documentation[filename] = {} unless documentation.filename?
  documentation[filename].classes     = classDefinitions
  documentation[filename].decorators  = decorators


runFileAnalysis = (filename) ->
  q(fs.readFile, filename, 'utf8')
    .then(getAbstractSyntaxTree)
    .then(documentPatterns filename)


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
    analysis =
      (runFileAnalysis(file) for file in config.files)
        .concat(runDirectoryAnalysis(dir) for dir in config.directories)

    RSVP.all(analysis)

  ).then(() ->

    console.log(documentation)

  ).catch(console.error)


main() if module is require.main
