
/*

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
 */

(function() {
  var printHeader, printModule, printPattern, repeat, toMarkdown;

  repeat = function(s, n) {
    return new Array(n + 1).join(s);
  };

  printHeader = function(title, level) {
    console.log("");
    if (level === 1) {
      console.log(title);
      return console.log(repeat("=", title.length));
    } else if (level === 2) {
      console.log(title);
      return console.log(repeat("-", title.length));
    } else {
      return console.log("" + (repeat("#", level)) + " " + title);
    }
  };

  printPattern = function(pattern, instances) {
    var data, instance, _results, _results1;
    if (pattern === "classes") {
      _results = [];
      for (instance in instances) {
        data = instances[instance];
        printHeader("`" + instance + "` Class", 2);
        _results.push(console.log("" + data['loc']['source'] + ":" + data['loc']['start']['line']));
      }
      return _results;
    } else if (pattern === "decorators") {
      _results1 = [];
      for (instance in instances) {
        data = instances[instance];
        printHeader("`" + instance + "` Decorator", 2);
        _results1.push(console.log("" + data['loc']['source'] + ":" + data['loc']['start']['line']));
      }
      return _results1;
    } else if (pattern === "modules") {
      return null;
    } else if (pattern === "singletons") {
      return null;
    }
  };

  printModule = function(module_name, patterns) {
    var instances, pattern, _results;
    printHeader("" + module_name + " API", 1);
    _results = [];
    for (pattern in patterns) {
      instances = patterns[pattern];
      _results.push(printPattern(pattern, instances));
    }
    return _results;
  };

  toMarkdown = function(analyses) {
    var filename, module_name, patterns, _results;
    _results = [];
    for (filename in analyses) {
      patterns = analyses[filename];
      module_name = filename.split(".")[0];
      _results.push(printModule(module_name, patterns));
    }
    return _results;
  };

  exports.pprint = function(s) {
    return toMarkdown(s);
  };

}).call(this);
