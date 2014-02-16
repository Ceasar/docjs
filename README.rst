================================================================================
doc.js
================================================================================

doc.js is a tool for generating program specifications from JavaScript source
code.

Setup
================================================================================

To install doc.js, simply::

    make install

Development
================================================================================

- Install `grunt-cli` globally.

- Run `grunt --debug-file=path/to/file.js` in the root directory to watch for
  changes & compile Coffeescript source code from src/ to the build/ directory.
  This command also runs a `nodemon` service in debug mode and `node-inspector`.

- Navigate to `http://localhost:8080/debug?port=5858` in Chrome to interactively
  debug your code.

JS source code examples for analysis are included in the examples/ dir.
