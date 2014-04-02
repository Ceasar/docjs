assert = require "should"


describe 'test', ->
  it 'should pass', ->
    [1,2,3].indexOf(4).should.equal(-1)
