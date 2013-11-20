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

  grunt.registerTask 'default', ['watch']
  grunt.registerTask 'buildjs', ['coffee']

