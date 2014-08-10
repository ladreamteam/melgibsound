module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            app: {
                src: 'main.js',
                dest: 'dist/main.pack.js'
            }
        },
        uglify: {
            app: {
                options: {
                    compress: true,
                    verbose: true,
                    banner: '// ==UserScript==\n// @name <%= pkg.name %>\n// @namespace <%= pkg.homepage %>\n// @include /https?:\/\/(www.)?facebook.com(\/.*)?/\n// @version <%= pkg.version %>\n// @grant GM_xmlhttpRequest\n// ==/UserScript==\n'
                },
                files: [
                    {
                        src: 'dist/main.pack.js',
                        dest: 'dist/<%= pkg.version %>.js'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['browserify', 'uglify']);

};