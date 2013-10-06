var fs      = require('fs')
  , esprima = require('esprima');

fs.readFile('examples/cucumber.js', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    } else {
        console.log(JSON.stringify(esprima.parse(data), null, 4));
    }
});
