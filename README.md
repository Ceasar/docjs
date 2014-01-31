# doc.js

doc.js is a tool for generating program specifications from JavaScript source code.

## Setup

This project uses `node` to run JavaScript files and requires various packages
from `npm` to be installed.

- `npm install` in the root directory
- `node build/somefile.js` to run parts of the project

## Development

- Install `grunt-cli` globally.
- Run `grunt --debug-file=path/to/file.js` in the root directory to watch for
  changes & compile Coffeescript source code from src/ to the build/ directory.
  This command also runs a `nodemon` service in debug mode and `node-inspector`.
- Navigate to `http://localhost:8080/debug?port=5858` in Chrome to interactively
  debug your code.

JS source code examples for analysis are included in the examples/ dir.

## Usage

TBD
