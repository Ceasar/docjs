assert      = require "should"
fs          = require "fs"
decorator   = require "../../src/patterns/decorator"
esprima     = require "esprima"


describe 'Decorators', ->
  it 'should find decorators when they are present', (done) ->
    filename = "analysis/targets/decorator.js"
    fs.readFile filename, 'utf8', (err, jsFile) ->
      ast = esprima.parse jsFile
      (decorator.findDecorators ast).should.have.lengthOf 1
      done()
  it 'should not find decorators when they not are present', (done) ->
    filename = "analysis/targets/cucumber.js"
    fs.readFile filename, 'utf8', (err, jsFile) ->
      ast = esprima.parse jsFile
      (decorator.findDecorators ast).should.have.lengthOf 0
      done()
