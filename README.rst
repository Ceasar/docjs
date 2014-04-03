================================================================================
doc.js
================================================================================

doc.js is a tool for generating program specifications from JavaScript source
code.

Setup
================================================================================

To install doc.js, simply::

    make install

Options
================================================================================

Configuration options are specified in ``config.json``.

**TODO**


Development
================================================================================

Development requires installing ``grunt-cli`` (``npm install -g grunt-cli``).

There are two ways to run doc-gen:

- To interactively debug the code:

  - Run ``grunt --debug-file=path/to/file.js`` in the root directory to watch for
    changes & compile Coffeescript source code from src/ to the build/ directory.

    This command also runs a *nodemon* service in debug mode and *node-inspector*.

  - Navigate to ``http://localhost:8080/debug?port=5858``

- To simply compile the source and run doc-gen with the specified config:

  - Run ``grunt`` in the root directory

  - Run ``node build/doc-gen.js``

JS source code examples for analysis are included in the examples/ dir.

Running tests
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To run the tests, simply::

    make test
