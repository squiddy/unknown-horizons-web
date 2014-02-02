module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            options: {
                livereload: true
            },
            livereload: {
                files: ['**/*.html', '**/*.css', 'src/*.js', '**/*.vert', '**/*.frag']
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    keepalive: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('default', ['watch', 'connect']);
};
