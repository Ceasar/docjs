(function() {
  var RSVP, config, documentation, findClasses, fs, q, runDirectoryAnalysis, runFileAnalysis, _;

  _ = require('lodash');

  fs = require('fs');

  RSVP = require('rsvp');

  q = require('./utils').q;

  findClasses = require('./find-class-pattern');

  config = require('./doc-gen-config');

  documentation = {};

  runFileAnalysis = function(filename) {
    return findClasses.getPromise(filename).then(function(definitions) {
      if (_.isEmpty(definitions)) {
        return;
      }
      if (documentation.filename == null) {
        documentation[filename] = {};
      }
      return documentation[filename].classes = definitions;
    });
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

  config.getPromise().then(function(config) {
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
    debugger;
  })["catch"](console.error);

}).call(this);
