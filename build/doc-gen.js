(function() {
  var OUTPUT_JSON_FILE, RSVP, acorn, config, documentPatterns, documentation, findClasses, findDecorators, findMVC, findModules, findSingletons, fs, getAbstractSyntaxTree, main, pprint, q, runDirectoryAnalysis, runFileAnalysis, writeOutputFilePromise, _;

  _ = require('lodash');

  fs = require('fs');

  RSVP = require('rsvp');

  acorn = require('acorn');

  q = require('./utils').q;

  findDecorators = require('./patterns/decorator').findDecorators;

  findClasses = require('./patterns/class').findClasses;

  findSingletons = require('./patterns/singleton').findSingletons;

  findModules = require('./patterns/module').findModules;

  findMVC = require('./patterns/mvc').findMVC;

  config = require('./doc-gen-config');

  pprint = require('./pprint');

  OUTPUT_JSON_FILE = 'view/patterns.json';

  getAbstractSyntaxTree = function(fileName) {
    return _.partialRight(acorn.parse, {
      locations: true,
      sourceFile: fileName
    });
  };

  documentation = {};

  documentPatterns = function(fileName) {
    return function(ast) {
      var classes, decorators, doc, modules, mvc, singletons;
      classes = findClasses(ast);
      decorators = findDecorators(ast);
      singletons = findSingletons(ast);
      modules = findModules(ast);
      mvc = findMVC(ast);
      if (_.every([classes, decorators, singletons, modules], _.isEmpty)) {
        return;
      }
      if (documentation.fileName == null) {
        doc = documentation[fileName] = {};
      }
      return doc.catalogs = _.chain([classes, decorators, singletons, modules]).reject(_.isEmpty).flatten().value();
    };
  };

  runFileAnalysis = function(fileName) {
    return q(fs.readFile, fileName, 'utf8').then(getAbstractSyntaxTree(fileName)).then(documentPatterns(fileName));
  };

  runDirectoryAnalysis = function(dirname) {
    var filterfileNames, runAnalysis;
    filterfileNames = function(fname) {
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
    return q(fs.readdir, dirname).then(_.partialRight(_.filter, filterfileNames)).then(_.partialRight(_.map, runAnalysis)).then(RSVP.all);
  };

  writeOutputFilePromise = function() {
    return q(fs.writeFile, OUTPUT_JSON_FILE, JSON.stringify(documentation));
  };

  main = function() {
    return config.getPromise().then(function(config) {
      var analyses, dir, file;
      analyses = ((function() {
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
      return RSVP.all(analyses);
    }).then(writeOutputFilePromise).then(function() {
      return console.log('Completed analysis.');
    })["catch"](console.error);
  };

  module.exports = {
    main: main
  };

  if (module === require.main) {
    main();
  }

}).call(this);
