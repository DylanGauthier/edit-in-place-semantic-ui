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
            files:['src/bs-eip.js']
        },
        browserify: {
            dist:{
                files: {
                    'dist/bs-eip.js': 'src/bs-eip.js'
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
                    'dist/bs-eip.min.js':'dist/bs-eip.js'
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