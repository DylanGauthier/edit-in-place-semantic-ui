module.exports = function(grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port:1337,
                    hostname: 'localhost',
                    livereload:true
                }
            }
        },
        watch: {
            files: ['src/**/*.*'],
            options:{
                livereload:true
            }
        },
        jshint: {
            files:['src/sui-eip.js']
        },
        browserify: {
            dist:{
                files: {
                    'dist/sui-eip.js': 'src/sui-eip.js'
                },
                options: {
                    transform: [['babelify', { presets: "es2015" }]],
                    browserifyOptions: {
                        debug: false
                    }
                }
            }
        },
        uglify: {
            build:{
                files:{
                    'dist/sui-eip.min.js':'dist/sui-eip.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['connect', 'watch']);
    grunt.registerTask('build', ['jshint','browserify:dist', 'uglify']);
}