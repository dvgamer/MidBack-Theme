var timer = require("grunt-timer");

module.exports = function(grunt) {
	timer.init(grunt, { deferLogs: true, friendlyTime: true, color: "blue" });
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
		clean: {
		  javascript: ['sources/js/app.min.js'],
		  scss: ['sources/css/site/**/*', 'sources/css/mintify/**/*'],
		  dist: ['dist/**/*']
		},
    uglify: {
      ie_fixed: {
        files: { 
        	'dist/ie-fixed.js': [
	        	'sources/js/html5/*.js'
        	] 
        }
      },
      app: {
        files: { 
        	'sources/js/app.min.js': [
	        	'sources/app-js/**/*.js'
        	] 
        }
      },
      vendor: {
        files: { 
        	'dist/vendor.js': [
	        	'sources/js/main/*.js',
	        	'sources/js/*.js',
	        	'sources/js/app.min.js'
        	] 
        }
      }
    },
	  sass: {
	    dist: {
	      files: [{
	        expand: true,
		      cwd: 'sources/app-scss',
	        src: ['**/*.scss'],
	        dest: 'sources/css/site',
	        ext: '.css'
	      }]
	    }
	  },
    cssmin: {
	   	vendor: {
		    files: [{
		      expand: true,
		      cwd: 'sources/css',
		      src: ['*.css'],
		      dest: 'sources/css/mintify/vendor',
		      ext: '.min.css'
		    }]
	  	},
	   	site: {
		    files: [{
		      expand: true,
		      cwd: 'sources/css/site',
		      src: ['**/*.css'],
		      dest: 'sources/css/mintify',
		      ext: '.min.css'
		    }]
		  }
    },
	  concat_css: {
	    options: {},
	    all: {
	      src: ["sources/css/mintify/**/*.css"],
	      dest: "dist/app.min.css"
	    },
	  },
    copy: {
      fonts: { 
        files: [{ expand: true, cwd:'sources/fonts/', src: '*.*', dest: 'dist/fonts/' }] 
      },
      icon: { 
        files: [{ expand: true, cwd:'sources/icon/', src: '*.*', dest: 'dist/icon/' }] 
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-concat-css');

  grunt.registerTask('js', ['uglify', 'sass']);
  grunt.registerTask('css', ['cssmin','concat_css']);

  grunt.registerTask('default', ['clean', 'js','css','copy']);
};