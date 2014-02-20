###
Attempting to identify module pattern
###

fs = require 'fs'
fingerrint = require './fingerrint'
{q} = require './utils'


readFile = (file) -> q(fs.readFile, file, 'utf8')


# Main
