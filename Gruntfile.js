'use strict';

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        ui: {
            app: 'app',
            dist: 'public'
        },

        clean: {
            build: '<%= ui.dist %>',
            server: '.tmp'
        },

        watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= ui.app %>/*.html',
                    '<%= ui.app %>/scripts/{,*/}*.js',
                    '<%= ui.app %>/styles/{,*/}*.css',
                    '<%= ui.app %>/templates/{,*/}*.html'
                ]
            },

            test: {
                options: {
                    livereload: '<%= connect.options.test %>'
                },
                files: [
                    '<%= ui.dist %>/*.html'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost' 
            },

            livereload: {
                options: {
                    open: true,
                    base: '<%= ui.app %>'
                }
            },

            test: {
                options: {
                    open: true,
                    base: '<%= ui.dist %>'
                }
            }
        },

        copy: {
            dist: {
                files:[
                    {   
                        expand: true, 
                        cwd: '<%= ui.app %>',
                        dest: '<%= ui.dist %>/',
                        src: ['*.html','*.json']
                    }
                ]
            }
        },

        requirejs:  {
            js: {
                options: {
                    baseUrl: '<%= ui.app %>',
                    mainConfigFile: '<%= ui.app %>/scripts/main.js',
                    include:['main'],
                    out: '<%= ui.dist %>/main.js',
                    findNestedDependencies: true
                }
            },

            css: {
                options: {
                    cssIn: '<%= ui.app %>/styles/main.css',
                    optimizeCss: "standard.keepComments.keepLines",
                    out: '<%= ui.dist %>/main.css'
                }
            }
        },

        htmlrefs: {
            dist: {
                src: '<%= ui.dist %>/index.html',
                dest: '<%= ui.dist %>/index.html'
            }
        }

    });

    grunt.registerTask('server', function (target) {
        grunt.task.run([
            'clean:server',
            'connect:livereload',
            'watch:livereload'
        ]);
    });

    grunt.registerTask('build', function (target) {   
        grunt.task.run([
            'clean:build',
            'copy:dist',
            'requirejs:css',
            'requirejs:js',
            'htmlrefs:dist'
        ]);
    });

    grunt.registerTask('test:build', function (target) {
        grunt.task.run([
            'connect:test',
            'watch:test'
        ]);
    });
};