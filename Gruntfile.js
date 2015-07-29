module.exports = function(grunt) {

    // Load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-karma');

    var taskRegister = {
        concat: {
            js: {
                src: ['src/**/*.js'],
                dest: 'build/js/app.js',
            },
        },
        uglify: {
            files: {
                'build/js/*.js' : 'build/js/app.min.js',
            }
        },
        less: {
            files: {
                src: ['src/less/main.less'],
                dest: 'build/css/style.css',
            }
        },
        karma: {
          unit: {
            configFile: 'karma.conf.js'
          }
        },
        watch: {
            options: {
                livereload: true,
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['concat:js']
            },
            css: {
                files: ['src/less/*.less'],
                tasks: ['less']
            },
        },
        connect: {
          server: {
            options: {
              livereload: true,
              port: 9000,
              base: ''
            }
          }
        }
    };
    grunt.initConfig(taskRegister);

    grunt.registerTask('serve', [
        'connect:server',
        'watch'
    ]);
};