(function() {
  var RSVP, acorn, config, documentPatterns, documentation, findClasses, findDecorators, findSingletons, fs, getAbstractSyntaxTree, main, q, runDirectoryAnalysis, runFileAnalysis, _;

  _ = require('lodash');

  fs = require('fs');

  RSVP = require('rsvp');

  acorn = require('acorn');

  q = require('./utils').q;

  findDecorators = require('./patterns/decorator').findDecorators;

  findClasses = require('./patterns/class').findClasses;

  findSingletons = require('./patterns/singleton').findSingletons;

  config = require('./doc-gen-config');

  getAbstractSyntaxTree = _.partialRight(acorn.parse, {
    locations: true
  });

  documentation = {};

  documentPatterns = function(filename) {
    return function(ast) {
      var classDefinitions, decorators, singletons;
      classDefinitions = findClasses(ast);
      decorators = findDecorators(ast);
      singletons = findSingletons(ast);
      if (_.isEmpty(classDefinitions) && _.isEmpty(decorators) && _.isEmpty(singletons)) {
        return;
      }
      if (documentation.filename == null) {
        documentation[filename] = {};
      }
      documentation[filename].classes = classDefinitions;
      documentation[filename].decorators = decorators;
      return documentation[filename].singletons = singletons;
    };
  };

  runFileAnalysis = function(filename) {
    return q(fs.readFile, filename, 'utf8').then(getAbstractSyntaxTree).then(documentPatterns(filename));
  };

  runDirectoryAnalysis = function(dirname) {
    var filterFilenames, runAnalysis;
    filterFilenames = function(fname) {
      return !fname.match(/^\./);
    };
    runAnalysis = function(fname) {
      var filepath;
      filepath = "" + dirname + "/" + fname;
      return q(fs.stat, filepath).then(function(fstats) {
        if (fstats.isDirectory()) {
          return runDirectoryAnalysis(filepath);
        } else if (fname.match(/\.js$/)) {
          return runFileAnalysis(filepath);
        }
      });
    };
    return q(fs.readdir, dirname).then(_.partialRight(_.filter, filterFilenames)).then(_.partialRight(_.map, runAnalysis)).then(RSVP.all);
  };

  main = function() {
    return config.getPromise().then(function(config) {
      var analysis, dir, file;
      analysis = ((function() {
        var _i, _len, _ref, _results;
        _ref = config.files;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          _results.push(runFileAnalysis(file));
        }
        return _results;
      })()).concat((function() {
        var _i, _len, _ref, _results;
        _ref = config.directories;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dir = _ref[_i];
          _results.push(runDirectoryAnalysis(dir));
        }
        return _results;
      })());
      return RSVP.all(analysis);
    }).then(function() {
      return console.log(documentation);
    })["catch"](console.error);
  };

  if (module === require.main) {
    main();
  }

}).call(this);
