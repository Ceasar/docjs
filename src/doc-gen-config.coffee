fs    = require 'fs'
_     = require 'lodash'
RSVP  = require 'rsvp'

{q}   = require './utils'

CONFIG_FILE_NAME = './config.json'

# -----------------------------------------------------------------------------
# Private

validateConfig = (config) ->
  return new RSVP.Promise (resolve, reject) ->
    if config.files? and !_.isArray(config.files)
      reject 'Invalid "files" parameter'

    if config.directories? and !_.isArray(config.directories)
      reject 'Invalid "directories" parameter'

    if config.patterns?
      p = config.patterns

      if !_.isObject(p)
        reject 'Invalid "patterns" parameter hash'

      if p.exclude? and !_.isArray(p.exclude)
        reject 'Invalid excluded patterns'

    resolve config

onFileReject = () ->
  console.error(
    '''
    \n ***********
    \n No config specified. Exiting doc-gen.
    \n ***********
    \n
    '''
  )
  return

# -----------------------------------------------------------------------------
# Public

exports.getPromise = () ->

  q(fs.readFile, CONFIG_FILE_NAME)
    .then(JSON.parse, onFileReject)
    .then(validateConfig)

