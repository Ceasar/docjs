###

pprint
~~~~~~

Generates Markdown from the result of doc-gen.js.

:param input:
  A value generated from doc-gen.js.

For example, given::

    { 'analysis/targets/classes-2.js':
       { classes: { __extends: [Object] },
         modules: { iifes: [Object], srcs: [Object], modules: [Object] } },
      'analysis/targets/classes.js':
       { classes:
          { Game: [Object],
            Puzzle: [Object],
            Jigsaw: [Object],
            Poker: [Object],
            VideoGame: [Object] },
         modules: { iifes: [Object], srcs: [Object], modules: [Object] } },
      'analysis/targets/cucumber.js':
       { classes: { Cucumber: [Object] },
         modules: { iifes: [Object], srcs: [Object], modules: [Object] } },
      'analysis/targets/decorator.js': { decorators: { fib: [Object] } },
      'analysis/targets/singleton.js':
       { singletons: { instance: [Object] },
         modules: { iifes: [Object], srcs: [Object], modules: [Object] } } }

The expected output would be::

    `games` API
    ===========
    example.js:1
    Dependencies: `window`, `document`, `jQuery` (jquery.min.js:1)

    `games.Puzzle` Class
    --------------------
    example.js:8

    Inherits:
    - `<private>.Game` example.js:2

    Properties:
    - `name` (inherited from `<private>.Game`)

    Methods:
    - `placePiece()` example.js:13


    `games.Jigsaw` Class
    --------------------
    example.js:19

    Inherits:
    - `games.Puzzle` example.js:8

    Properties:
    - `name` (inherited from `games.Puzzle`)
    - `type`

    Methods:
    - `placePiece()` (inherited from `games.Puzzle`) example.js:13


    `myMethod` Function
    -------------------
    example.js:30

    `myProperty` Property
    ---------------------
    example.js:34

###

repeat = (s, n) ->
  new Array(n + 1).join(s)

printHeader = (title, level) ->
  console.log ""
  if level is 1
    console.log title
    console.log repeat("=", title.length)
  else if level is 2
    console.log title
    console.log repeat("-", title.length)
  else
    console.log "#{repeat("#", level)} #{title}"

printPattern = (pattern, instances) ->
  if pattern is "classes"
    for instance, data of instances
      printHeader "`#{instance}` Class", 2
      console.log "#{data['loc']['source']}:#{data['loc']['start']['line']}"
  else if pattern is "decorators"
    for instance, data of instances
      printHeader "`#{instance}` Decorator", 2
      console.log "#{data['loc']['source']}:#{data['loc']['start']['line']}"
  else if pattern is "modules"
    null
  else if pattern is "singletons"
    null

printModule = (module_name, patterns) ->
  printHeader("#{module_name} API", 1)
  for pattern, instances of patterns
    printPattern(pattern, instances)

toMarkdown = (analyses) ->
  for filename, patterns of analyses
    module_name = filename.split(".")[0]
    printModule(module_name, patterns)

exports.pprint = (s) ->
  toMarkdown(s)
