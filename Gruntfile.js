module.exports = function(grunt) {

    grunt.initConfig({
        watch: {
            options: {
                livereload: true
            },
            livereload: {
                files: ['index.html', 'all.js', 'data/shaders/*']
            },
            src: {
                files: ['src/**/*.js'],
                tasks: ['spawn:traceur']
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    keepalive: true
                }
            }
        },
        spawn: {
            traceur: {
                command: 'node',
                commandArgs: ['node_modules/traceur/traceur',
                              '--sourcemap',
                              '--out', 'all.js', 'src/main.js'], 
                directory: '.',
                pattern: 'src/main.js'
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-spawn');
    grunt.registerTask('default', ['watch', 'connect']);
};
