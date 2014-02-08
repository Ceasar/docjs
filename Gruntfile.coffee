module.exports = (grunt) ->

  matchDep = require('matchdep')
  matchDep.filterDev('grunt-*').forEach grunt.loadNpmTasks

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    # ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    coffee:
      glob_to_multiple:
        expand: true
        cwd: 'src/'
        src: ['*.coffee']
        dest: 'build/'
        ext: '.js'

    # ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    watch:
      coffee:
        files: ['src/**/*.coffee']
        tasks: ['buildjs']
        options:
          debounceDelay: 2000

    # ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    nodemon:
      dev:
        script: grunt.option('debug-file')
        options:
          nodeArgs: ['--debug-brk']
          ext: 'js'
          watch: 'build'

    # ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    'node-inspector':
      dev: {}

    # ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    concurrent:
      tasks: ['nodemon:dev', 'watch', 'node-inspector:dev']
      options:
        logConcurrentOutput: true


  grunt.registerTask 'default', ['concurrent']
  grunt.registerTask 'buildjs', ['coffee']

