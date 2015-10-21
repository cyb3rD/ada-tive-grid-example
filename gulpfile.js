var gulp = require("gulp"),
	browserSync = require ("browser-sync"),
	compass = require("gulp-compass"),
	jade = require ("gulp-jade"),
	plumber = require("gulp-plumber");

// paths & settings
var paths = {
	browserSync : {
		serverPort 	: 9000,
		baseDir 	: 'app',
		watchPaths 	: ['*.html', 'css/*.css', 'js/*.js']
	},

	watchDirs : {
		watchPaths	: ['app/*.html', 'app/js/**/*.js', 'app/css/**/*.css']
	},

	scss : {
		location	: 'styles/**/*.scss',
		entryPoint	: 'css/main.css'
	},

	compass : {
		configFile	: 'config.rb',
		cssFolder	: 'css',
		scssFolder	: 'styles',
		imgFolder	: 'img'
	},

	jade: {
		location	: 'app/layout/**/*.jade',
		compiled	: 'app/layout/*.jade',
		destination : 'app'
		}
}

// JADE
gulp.task('jade', function() {
	gulp.src(paths.jade.compiled)
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t', // format code, remove tabs
		}))
		.pipe(gulp.dest(paths.jade.destination));
});

// Server (BrowserReload)
gulp.task('server', function () {
	browserSync.init({
		port : paths.browserSync.serverPort,
		server: {
			baseDir: paths.browserSync.baseDir
		}
	});
});

// Scss + compass
gulp.task('compass', function() {
	gulp.src(paths.scss.location)
		.pipe(plumber())
		.pipe(compass({
			config_file: paths.compass.configFile,
			css: paths.compass.cssFolder,
			sass: paths.compass.scssFolder,
			image: paths.compass.imgFolder
		}));
});

// Watch (Jade + BrowserSync reload
gulp.task('watch', function () {
	gulp.watch(paths.jade.location, ['jade']);

	gulp.watch (paths.watchDirs.watchPaths).on('change', browserSync.reload);
});

// Default task
gulp.task('default', ['jade', 'compass', 'server', 'watch']);