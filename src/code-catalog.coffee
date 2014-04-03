_     = require 'lodash'
Model = require 'fishbone'

###
# A simple dictionary to keep track of code pointers in target source code.
# Includes a simple event emitter and prevents overwriting of entries (unless
# you remove that key first).
###
exports.CodeCatalog = Model

  init: (entries) ->
    @[k] = v for own k, v of entries

  add: (name, pointer) ->
    return false if @has(name)
    @trigger 'add', { name: name, pointer: pointer }
    @[name] = pointer
    return true

  remove: (name) ->
    return false unless @has(name)
    @trigger 'remove', { name: name }
    delete @[name]
    return true

  has: (name) -> @[name]?

  get: (name) -> @[name]

  toJSON: ()  -> _.omit(@, _.isFunction)
