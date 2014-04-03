(function() {
  var CONFIG_FILE_NAME, fs;

  fs = require('fs');

  CONFIG_FILE_NAME = './config.json';

  exports.getConfig = function() {
    return fs.readFile;
  };

}).call(this);
