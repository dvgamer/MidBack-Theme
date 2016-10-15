module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      jquery: { files: [{ expand: true, cwd: 'bower_components/jquery/dist/', src: 'jquery.js', dest: 'src/js/' }] }
    },
    uglify: {
      app: {
        files: { 'dist/app.js': ['src/js/*.js'] }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['copy']);
};