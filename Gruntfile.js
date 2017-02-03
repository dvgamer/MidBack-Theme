var timer = require("grunt-timer");

module.exports = function(grunt) {
	timer.init(grunt, { deferLogs: true, friendlyTime: true, color: "blue" });
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'), 
		clean: {
		  javascript: ['sources/js/app/app.js'],
		  scss: ['sources/css/site/**/*', 'sources/css/mintify/**/*'],
		  dist: ['dist/**/*']
		},
    // babel: {
    //   options: {
    //     sourceMap: true,
    //     presets: ['es2015']
    //   },
    //   dist: {
    //     files: {
    //       'dist/app.js': 'src/app.js'
    //     }
    //   }
    // },
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
        	'sources/js/app/app.js': [
	        	'sources/app-js/**/*.js'
        	] 
        }
      }, 
      dev: {
        files: { 
        	'dist/app.min.js': [
	        	'sources/app-js/**/*.js'
        	] 
        }
      }, 
      vendor: {
        files: { 
        	'dist/vendor.min.js': [
	        	'sources/js/main/*.js',
	        	'sources/js/*.js'
        	] 
        }
      }, 
      bundle: {
        files: { 
        	'dist/bundle.min.js': [
	        	'sources/js/main/*.js',
	        	'sources/js/*.js',
	        	'sources/js/app/app.js'
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
	    }
	  },
    copy: {
      fonts: { 
        files: [{ expand: true, cwd:'sources/fonts/', src: '*.*', dest: 'dist/fonts/' }] 
      },
      icon: { 
        files: [{ expand: true, cwd:'sources/icon/', src: '*.*', dest: 'dist/icon/' }] 
      },
      dev: {
        files: [{ 
          expand: true,  
          cwd:'dist/', 
          src: ['vendor.min.js','app.min.css', 'app.min.js'], 
          dest: '../Midback-Office/TravoxReservation/travoxmosWeb/dist/' 
        }]
      }
    },
		watch: {
		  js: {
		    files: ['sources/js/main/*.js','sources/js/*.js','sources/app-js/**/*.js'],
		    tasks: ['uglify:dev','copy:dev'],
		    options: {
		      debounceDelay: 500,
		    },
		  }, 
		  css: {
		    files: ['sources/css/*.css','sources/app-scss/**/*.scss'],
		    tasks: ['clean:scss','sass','cssmin', 'concat_css','copy:dev'],
		    options: {
		      debounceDelay: 500,
		    },
		  },
		}
  });

  // callback 
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-concat-css');
  grunt.loadNpmTasks("grunt-then");

  //bundle build
  grunt.registerTask('js', ['uglify:ie_fixed', 'uglify:app', 'uglify:bundle', 'sass']);
  grunt.registerTask('css', ['cssmin', 'concat_css']);
  grunt.registerTask('default', ['clean', 'js','css']);

  //develop build
  grunt.registerTask('pre', ['uglify:vendor','uglify:dev','sass','cssmin', 'concat_css']);
  grunt.registerTask('dev', ['clean','pre','copy','watch']);
}; 