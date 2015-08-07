module.exports = function(grunt) {

    // Load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-karma');

    var taskRegister = {
        concat: {
            js: {
                src: ['src/**/*.js'],
                dest: 'build/js/app.js',
            },
            css: {
                src: [
                    'build/css/normalize.css',
                    'build/css/style.css',
                    'bower_components/fullcalendar/dist/fullcalendar.css'
                ],
                dest: 'build/css/main.css', 
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            app: {
                files: {
                    'build/js/app.min.js': ['build/js/app.js']
                }   
            },
            vendor: {
                files: {
                    'build/js/vendor.min.js': [
                        'bower_components/angular/angular.js', 
                        'bower_components/angular-route/angular-route.js', 
                        'bower_components/jquery/dist/jquery.min.js', 
                        'bower_components/moment/min/moment.min.js', 
                        'bower_components/angular-ui-calendar/src/calendar.js', 
                        'bower_components/fullcalendar/dist/fullcalendar.js', 
                        'bower_components/fullcalendar/dist/gcal.js'
                    ]
                }
            }
        },
        less: {
            files: {
                src: ['src/less/main.less'],
                dest: 'build/css/style.css',
            }
        },
        cssmin: {
            files: {
                src: 'build/css/main.css',
                dest:'build/css/style.min.css'
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