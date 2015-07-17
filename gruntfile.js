module.exports = function (grunt) {
	var src = 'src/',
		dist = 'dist/',
		temp = '.temp/',

		mozjpeg = require('imagemin-mozjpeg'); // Needed for imagemin to work on jpg files


	grunt.initConfig({

		// CONFIG /////////////////////////////////////////////////////////////////////////////////////////////////////

		config: {
			// js files need to be included in a specific order to work, so we can't use a wildcard
			jsSrcFiles: [
				src + 'js/app/App.js',
				src + 'js/app/components/App.Component.Example.js',
				src + 'js/app/components/App.Component.Footer.js',
				src + 'js/app/components/App.Component.Header.js',
				src + 'js/app/components/App.Component.Navigation.js'
			],

			// html files need to be each specifically defined as below due to weirdness with grunt bake
			htmlFiles: {
				'dist/about.html': src + 'about.html',
				'dist/contact.html': src + 'contact.html',
				'dist/index.html': src + 'index.html'
			},

			// remaining files can use wildcards
			scssSrcFiles: [src + 'scss/**/*.scss'],
			svgSrcFiles: src + 'svg/*.svg',
			imgSrcFiles: [src + 'img/*.jpg', src + 'img/*.png'],
			scssDistFolder: dist + 'css/',
			scssDistFile: dist + 'css/' + 'main.css',
			htmlSrcFiles: [src + '*.html', src + 'inc/**/*.inc'],
			jsDistFile: dist + 'js/scripts.js',
			svgDistFolder: temp + 'svg/', // for outputting individual minified svgs
			svgDistFiles: temp + 'svg/*.svg', // for reading out individual minified svgs
			svgDistFile: temp + 'spritesheet.svg', // for outputting the combined svg spritesheet
			imgDistFiles: [dist + 'img/*.jpg', src + 'img/*.png'],

			// additional folders for tasks
			scssLintIgnoredFiles: [src + 'scss/vendor/**/*.scss'],
			htmlMinFiles: [dist + '*.html']
		},


		// SCSSTASK ///////////////////////////////////////////////////////////////////////////////////////////////////

		// Lints SCSS files for potential problems
		scsslint: {
			options: {
				//bundleExec: true,
				compact: true,
				config: '.scss-lint.yml',
				force: true,
				exclude: '<%= config.scssLintIgnoredFiles %>'
			},
			allFiles: '<%= config.scssSrcFiles %>'
		},

		// Compile SCSS files into CSS files
		sass: {
			comps: {
				options: {
					style: 'expanded'
				},
				files: [{
					expand: true,
					src: '<%= config.scssSrcFiles %>',
					dest: '<%= config.scssDistFolder %>',
					ext: '.css',
					flatten: true
				}]
			}
		},

		// Combines media queries in CSS files to reduce file size.
		cmq: {
			options: {
				log: false
			},
			your_target: {
				files: {
					'<%= config.scssDistFile %>': '<%= config.scssDistFile %>'
				}
			}
		},

		// Automatically inserts vendor prefixes into generated CSS.
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 9']
			},
			your_target: {
				src: '<%= config.scssDistFile %>',
				dest: '<%= config.scssDistFile %>'
			}
		},

		// Minifies CSS.
		cssmin: {
			target: {
				files: {
					'<%= config.scssDistFile %>': '<%= config.scssDistFile %>'
				}
			}
		},


		// JSTASK /////////////////////////////////////////////////////////////////////////////////////////////////////

		// Check JS code styling
		jscs: {
			src: '<%= config.jsSrcFiles %>',
			options: {
				config: ".jscsrc",
				force: true,
				verbose: false
			}
		},

		// Lints JS files for potential problems
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				force: true
			},
			all: '<%= config.jsSrcFiles %>'
		},

		// Combines and minifies js files
		uglify: {
			options: {
				mangle: false,
				sourceMap: true
			},
			my_target: {
				files: {
					'<%= config.jsDistFile %>': '<%= config.jsSrcFiles %>'
				}
			}
		},


		// SVGTASK/ ///////////////////////////////////////////////////////////////////////////////////////////////////

		// Minifies individual SVG files from the source files to reduce file size
		svgmin: {
			options: {
				plugins: [{
					removeViewBox: false
				}, {
					removeUselessStrokeAndFill: true
				}, {
					removeEmptyAttrs: true
				}, {
					cleanupIDs: false
				}]
			},
			default: {
				files: [{
					expand: true,
					flatten: true,
					src: '<%= config.svgSrcFiles %>',
					dest: '<%= config.svgDistFolder %>'
				}]
			}
		},

		// Builds the SVG spritesheet from the minified SVG files
		svgstore: {
			options: {
				prefix: 'icon-',
				cleanup: ['fill', 'stroke', 'style'],
				svg: {
					viewBox: '0 0 100 100',
					xmlns: 'http://www.w3.org/2000/svg'
				}
			},
			default: {
				files: {
					'<%= config.svgDistFile %>': '<%= config.svgDistFiles %>'
				}
			}
		},


		// IMGTASK ////////////////////////////////////////////////////////////////////////////////////////////////////

		// Optimizes and minifies images
		imagemin: {
			static: {
				options: {
					optimizationLevel: 3,
					use: [mozjpeg()]
				},
				files: {
					'<%= config.imgDistFiles %>': '<%= config.imgSrcFiles %>'
				}
			}
		},


		// HTMLTASK ///////////////////////////////////////////////////////////////////////////////////////////////////

		// Bakes static html files from dynamic html files/json data
		bake: {
			your_target: {
				files: '<%= config.htmlFiles %>'
			}
		},

		// Minifies built HTML files to reduce file size.
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
					removeRedundantAttributes: true,
					useShortDoctype: true,
					removeEmptyAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true,
					removeOptionalTags: true
				},
				files:
				{
					// TODO fix this
					// can we use a wildcard for this, unlike the bake task?
					'index.html': '.temp/index.temp.html'
					// '<%= config.htmlMinFiles %>'
				}
			}
		},


		// SERVERTASK /////////////////////////////////////////////////////////////////////////////////////////////////

		// Creates and runs a basic web server
		connect: {
			server: {
				options: {
					useAvailablePort: true,
					hostname: '127.0.0.1',
					base: dist,
					livereload: true,
					open: true
				}
			}
		},

		// Watch different file types and trigger tasks when a change is detected
		watch: {
			scss: {
				files: '<%= config.scssSrcFiles %>',
				tasks: ['scssTask']
			},
			js: {
				files: '<%= config.jsSrcFiles %>',
				tasks: ['jsTask']
			},
			/*svg: {
				files: '<%= svgSrcFiles %>',
				tasks: ['svgTask', 'htmlTask']
			},*/
			/*img: {
				files: '<%= imgSrcFiles %>',
				tasks: ['imgTask']
			},*/
			html: {
				files: '<%= config.htmlSrcFiles %>',
				tasks: ['htmlTask']
			},
			options: {
				livereload: true
			}
		}
	});

	// All grunt tasks
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks("grunt-bake");
	grunt.loadNpmTasks('grunt-combine-media-queries');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-jscs");
	grunt.loadNpmTasks('grunt-scss-lint');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-svgstore');

	// Register the general use tasks for different file types, as these are used multiple times
	grunt.registerTask('scssTask', ['scsslint', 'sass', 'cmq', 'autoprefixer', 'cssmin']);
	grunt.registerTask('jsTask', ['jscs', 'jshint', 'uglify']);
	grunt.registerTask('spriteTask', ['sprite', 'imagemin']);
	grunt.registerTask('svgTask', ['svgmin', 'svgstore']);
	grunt.registerTask('imgTask', ['imagemin']);
	grunt.registerTask('htmlTask', ['bake', 'htmlmin']);
	grunt.registerTask('serverTask', ['connect', 'watch']);

	// Register the default task when running grunt
	grunt.registerTask('default', ['scssTask', 'jsTask', 'svgTask', /*'imgTask',*/ 'htmlTask', 'serverTask']);
};