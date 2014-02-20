fs    = require 'fs'
_     = require 'lodash'
RSVP  = require 'rsvp'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'

{q} = require './utils'
{getChildren, nodeWalk} = require('./ast')
NODE_TYPES = require('./types').types


# ============================================================================
# Utils
# ============================================================================

utils =
  getProp: (propName) -> (object) -> object[propName]

projectUtils =
  getPatternFile: (name) -> "analysis/patterns/#{name}.js"
  getFingerprintFile: (name) -> "analysis/fingerprints/#{name}.json"
  getTargetFile: (name) -> "analysis/targets/#{name}.js"


# ============================================================================
# Hashing
#
#   A "hash" for a subtree of the AST is an object that keeps track of the count
#   of each node type present in the subtree, essentially a node-type vector.
# ============================================================================

# Combine a list of hashes into a single object
combineHashes = (hashes) ->
  combined = {}
  for h in hashes
    for own nodeType, count of h
      combined[nodeType] = 0 unless combined[nodeType]?
      combined[nodeType] += count
  return combined

computeHash = (node) ->
  hashes = (child.hash for child in getChildren(node))
  hash = if hashes.length then combineHashes(hashes) else {}
  hash[node.type] = if hash[node.type]? then hash[node.type] + 1 else 1
  return hash


# ============================================================================
# Pattern Identification
# ============================================================================

# Returns a promise that resolves when a file has been read, its AST traversed,
# and a fingerprint hash generated.
generateFingerprint = (fileName) ->
  # Look at documented iterator pattern and compute its hash
  q(fs.readFile, fileName, 'utf8').then (jsFile) ->
    ast = acorn.parse(jsFile)
    storeNodeHash = (node) -> node.hash = computeHash(node)

    nodeWalk ast, storeNodeHash
    return ast

# Returns a promise that resolves when a fingerprint is generated and exported
# to a JSON file.
fingerprintPattern = (patternName) ->

  patternFile = projectUtils.getPatternFile(patternName)
  fingerprintFile = projectUtils.getFingerprintFile(patternName)

  successMsg = (name) -> "Saved fingerprint for pattern #{name}."

  # Given an already fingerprinted AST (its subtree hashes exist in the tree),
  # write the fingerprint to a file associated with the pattern.
  exportFingerprint = (ast) ->
    if ast.hash?
      contents = JSON.stringify(ast.hash)
      q(fs.writeFile, fingerprintFile, contents).then(successMsg)

    else
      console.error "No fingerprint found to export"

  return generateFingerprint(patternFile).then(exportFingerprint)

# TODO: figure out how to compare the AST hashes
identifyPattern = (target, pattern) ->

  targetFile = projectUtils.getTargetFile(target)
  fingerprintFile = projectUtils.getFingerprintFile(pattern)

  # Returns a promise that resolves when (1) the ast hash for a target file has
  # been generated and (2) a documented pattern fingerprint is parsed as JSON.
  return RSVP.hash({
    targetHash: generateFingerprint(targetFile).then(utils.getProp 'hash')
    fingerprint: q(fs.readFile, fingerprintFile, 'utf8').then(JSON.parse)
  }).then(({targetHash, fingerprint}) ->
    debugger

  ).catch(console.error)



# ============================================================================
# Main execution
# ============================================================================

# fingerprintPattern('iterator').then (msg) ->
#   console.log(msg)

identifyPattern('loops', 'iterator').then (msg) ->
  console.log(msg)

# ============================================================================

module.exports =
  projectUtils: projectUtils
  pattern: fingerprintPattern
  identify: identifyPattern

