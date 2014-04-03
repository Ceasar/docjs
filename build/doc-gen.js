(function() {
  var findClasses;

  findClasses = require('./find-class-pattern');

  findClasses.getPromise('analysis/targets/classes.js').then(console.log)["catch"](console.error);

}).call(this);
