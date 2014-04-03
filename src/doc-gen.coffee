_     = require 'lodash'
fs    = require 'fs'
RSVP  = require 'rsvp'

{q}         = require './utils'
findClasses = require('./find-class-pattern')
config      = require('./doc-gen-config')

# -----------------------------------------------------------------------------

documentation = {}

runFileAnalysis = (filename) ->
  # TODO: add more pattern matching

  findClasses.getPromise(filename)
    .then (definitions) ->
      return if _.isEmpty(definitions)
      documentation[filename] = {} unless documentation.filename?
      documentation[filename].classes = definitions

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

config.getPromise().then((config) ->
  analysis =
    (runFileAnalysis(file) for file in config.files)
      .concat(runDirectoryAnalysis(dir) for dir in config.directories)

  RSVP.all(analysis)

).then(() ->
  debugger
).catch(console.error)

