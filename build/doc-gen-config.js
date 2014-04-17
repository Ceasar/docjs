(function() {
  var CONFIG_FILE_NAME, RSVP, fs, onFileReject, q, validateConfig, _;

  fs = require('fs');

  _ = require('lodash');

  RSVP = require('rsvp');

  q = require('./utils').q;

  CONFIG_FILE_NAME = './config.json';

  validateConfig = function(config) {
    return new RSVP.Promise(function(resolve, reject) {
      var p;
      if ((config.files != null) && !_.isArray(config.files)) {
        reject('Invalid "files" parameter');
      }
      if ((config.directories != null) && !_.isArray(config.directories)) {
        reject('Invalid "directories" parameter');
      }
      if (config.patterns != null) {
        p = config.patterns;
        if (!_.isObject(p)) {
          reject('Invalid "patterns" parameter hash');
        }
        if ((p.exclude != null) && !_.isArray(p.exclude)) {
          reject('Invalid excluded patterns');
        }
      }
      return resolve(config);
    });
  };

  onFileReject = function() {
    console.error('\n ***********\n\n No config specified. Exiting doc-gen.\n\n ***********\n\n');
  };

  exports.getPromise = function() {
    return q(fs.readFile, CONFIG_FILE_NAME).then(JSON.parse, onFileReject).then(validateConfig);
  };

}).call(this);
