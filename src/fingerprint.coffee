fs    = require 'fs'
_     = require 'lodash'
RSVP  = require 'rsvp'
acorn = require 'acorn'
walk  = require 'acorn/util/walk'

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


treeUtils =
  # Check if a given value is a subtree in the Parser API
  isSubTree: (obj) ->
    return false unless obj?

    # If an array, each element should be a node with a 'type' property
    if _.isArray(obj) and obj.length > 0
      return obj[0].type?
    # Otherwise, this should be a node itself
    else
      return obj.type?

  # Return the immediate children of a given node
  getChildren: (node) ->
    children = []

    # Check all properties for nodes or node arrays
    for own k, v of node
      if v?.type?
        children.push(v)
      else if _.isArray(v) and v.length
        for childNode in v
          children.push(childNode) if childNode.type?

    # Special cases
    if node.type in ['LetStatement', 'LetExpression']
      for h in node.head
        children.push(h.id)
        children.push(h.init) if h.init?

    else if node.type in ['ObjectExpression', 'ObjectPattern']
      for prop in node.properties
        children.push(prop.key)
        children.push(prop.value)

    return children

# Promise wrapper for fs
promisedFS =
  read: (fileName) -> new RSVP.Promise (resolve, reject) ->
    fs.readFile fileName, 'utf8', (err, contents) ->
      if err? then reject(err) else resolve(contents)

  write: (fileName, contents) -> new RSVP.Promise (resolve, reject) ->
    fs.writeFile fileName, contents, (err) ->
      if err? then reject(err) else resolve()



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
  hashes = (child.hash for child in treeUtils.getChildren(node))
  hash = if hashes.length then combineHashes(hashes) else {}
  hash[node.type] = if hash[node.type]? then hash[node.type] + 1 else 1
  return hash


# ============================================================================
# Pattern Identification
# ============================================================================

# A generic function to walk the AST
nodeWalk = (node, fn, fnMap) ->
  for child in treeUtils.getChildren(node)
    nodeWalk(child, fn, fnMap)

  fnMap[node.type](node) if fnMap?[node.type]?
  fn(node) if fn?

# Returns a promise that resolves when a file has been read, its AST traversed,
# and a fingerprint hash generated.
generateFingerprint = (fileName) ->
  # Look at documented iterator pattern and compute its hash
  promisedFS.read(fileName).then (jsFile) ->
    ast = acorn.parse(jsFile)
    storeNodeHash = (node) -> node.hash = computeHash(node)

    nodeWalk ast, storeNodeHash
    return ast

# Returns a promise that resolves when a fingerprint is generated and exported
# to a JSON file.
fingerprintPattern = (patternName) ->

  patternFile = projectUtils.getPatternFile(patternName)
  fingerprintFile = projectUtils.getFingerprintFile(patternName)

  # Given an already fingerprinted AST (its subtree hashes exist in the tree),
  # write the fingerprint to a file associated with the pattern.
  exportFingerprint = (ast) ->
    if ast.hash?
      contents = JSON.stringify(ast.hash)
      promisedFS.write(fingerprintFile, contents).then () ->
        return "Saved fingerprint for pattern #{patternName}."

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
    fingerprint: promisedFS.read(fingerprintFile).then(JSON.parse)
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
  treeUtils: treeUtils
  pattern: fingerprintPattern
  identify: identifyPattern

