(function() {
  var acorn, filename, findClasses, findDecorators, fs, getAbstractSyntaxTree, main, q, _;

  _ = require('lodash');

  fs = require('fs');

  acorn = require('acorn');

  q = require('./utils').q;

  findDecorators = require('./patterns/decorator').findDecorators;

  findClasses = require('./patterns/class').findClasses;

  getAbstractSyntaxTree = _.partialRight(acorn.parse, {
    locations: true
  });

  main = function(filename) {
    return q(fs.readFile, filename, 'utf8').then(getAbstractSyntaxTree).then(function(ast) {
      var classes, decorators;
      decorators = findDecorators(ast);
      classes = findClasses(ast);
      console.log('*** decorators ***');
      console.log(decorators);
      console.log('*** classes ***');
      return console.log(classes);
    });
  };

  if (module === require.main) {
    filename = process.argv[2];
    main(filename);
  }

}).call(this);
