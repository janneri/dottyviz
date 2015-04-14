module.exports = function(grunt) {
  "use strict";
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    prodfolder: "appengine/dottyviz/ui",

    clean: ["<%= prodfolder %>/*"],

    jshint: {
      options: { "force": true },
      all: ['Gruntfile.js', 'app/js/*.js']
    },

    uglify: {
      prod: {
        src: 'app/js/**/*.js',
        dest: '<%= prodfolder %>/<%= pkg.name %>.min.js'
      }
    },

    cssmin: {
      minify: {
        expand: true,
        flatten: true,
        src: ['app/**/*.css', '!*.min.css'],
        dest: '<%= prodfolder %>/',
        ext: '.min.css'
      }
    },

    linkerCSSOptions: {
          startTag: '<!--styles-->',
          endTag: '<!--styles end-->',
          fileTmpl: '<link rel="stylesheet" href="%s" />'
    },

    'sails-linker': {
      options: {
          startTag: '<!--scripts-->',
          endTag: '<!--scripts end-->',
          fileTmpl: '<script type="text/javascript" src="%s"></script>'
      },
      dev: {
        files: {
          'index.html': ['app/js/*.js', 'vendor/js/*.js']
        }
      },
      prod: {
        options: { appRoot: '<%= prodfolder %>/' },
        files: {
          '<%= prodfolder %>/index.html': ['<%= prodfolder %>/*.js']
        }
      },
      devcss: {
        options: {
          startTag: '<!--styles-->',
          endTag: '<!--styles end-->',
          fileTmpl: '<link rel="stylesheet" href="%s" />'
        },
        files: {
          'index.html': ['app/css/*.css', 'vendor/css/*.css']
        }
      },  
      prodcss: {
        options: {
          startTag: '<!--styles-->',
          endTag: '<!--styles end-->',
          fileTmpl: '<link rel="stylesheet" href="%s" />',
          appRoot: '<%= prodfolder %>/' 
        },
        files: {
          '<%= prodfolder %>/index.html': ['<%= prodfolder %>/*.css']
        }
      }
    },

    copy: {
      dev: {
        expand: true, // enables ext
        ext: ".html", //  change file ending to html
        src: ['*.tmpl'], dest: './'
      },
      prod: {
        expand: true, ext: ".html", src: ['*.tmpl'], dest: '<%= prodfolder %>'
      }
    },

    concat: {
      options: {
        separator: ';',
      },
      prod: {
        src: ['vendor/**/*.js'],
        dest: '<%= prodfolder %>/vendor.js',
      },
    },

    watch: {
      scripts: {
        files: ['app/js/*.js'],
        tasks: ['dev'],
        options: {
          spawn: false,
        },
      },
      tmpl: {
        files: ['*.tmpl'],
        tasks: ['dev'],
      },
      css: {
        files: ['app/css/*.css'],
        tasks: ['sails-linker:devcss'],
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sails-linker');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['copy:dev', 'uglify', 'sails-linker:default_options']);

  grunt.registerTask('dev', ['jshint', 'copy:dev', 'sails-linker:dev', 'sails-linker:devcss']);

  grunt.registerTask('dist', ['clean', 'copy:prod', 'uglify:prod', 'cssmin', 'concat:prod',
    'sails-linker:prod', 'sails-linker:prodcss']);


};
