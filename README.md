# doc.js

doc.js is a tool for generating program specifications from JavaScript source code.

## Setup

Running the project requires `node` and `npm` to be installed.

- `npm install` in the root directory
- `node build/somefile.js` to run parts of the project

## Development

__Recommended development workflow__:

- Install `grunt-cli`, `nodemon`, and `node-inspector` npm packages globally.
- Run `grunt` in the root directory to watch for changes & compile
  Coffeescript source code from src/ to the build/ directory.
- Run `nodemon --debug-brk build/yourFile.js` to start a node debugger process
  that restarts if a file is updated.
- Run `node-inspector` concurrently. Navigate to
  `http://127.0.0.1:8080/debug?port=5858` in Chrome to interactively debug your
  code.

JS source code examples for analysis are included in the examples/ dir.

## Usage

TBD
