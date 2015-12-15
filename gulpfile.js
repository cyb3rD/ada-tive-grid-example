var gulp = require("gulp"),
	browserSync = require ("browser-sync"),
	compass = require("gulp-compass"),
	jade = require ("gulp-jade"),
	plumber = require("gulp-plumber"),
	autoprefixer = require ("gulp-autoprefixer"),
	del = require("del"),
	imagemin = require("gulp-imagemin"),
	sass = require('gulp-sass'),
	filter = require("gulp-filter"),
	useref = require("gulp-useref"),
	gulpif = require("gulp-if"),
	uglify = require("gulp-uglify"),
	minifyCss = require("gulp-minify-css"),
	sourcemaps = require("gulp-sourcemaps"),
	size = require("gulp-size");

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
		location	: 'app/styles/**/*.scss',
		entryPoint	: 'app/css/main.css'
	},

	compass : {
		configFile	: 'config.rb',
		cssFolder	: 'app/css',
		scssFolder	: 'app/styles',
		imgFolder	: 'app/img'
	},

	jade: {
		location	: 'app/layout/**/*.jade',
		compiled	: 'app/layout/_pages/*.jade',
		destination : 'app'
		},

	dist: {
		html_dist	: './dist',
		css_dist	: './dist/css'
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
		// Tunnel for access from remote PC
		// tunnel: 'samplestore',
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
	gulp.watch(paths.scss.location, ['compass']);

	gulp.watch (paths.watchDirs.watchPaths).on('change', browserSync.reload);
});


// AutoPrefixer
gulp.task('autoprefixer', function() {
	gulp.src(paths.scss.entryPoint)
		.pipe(plumber())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(paths.scss.entryPoint));
});

gulp.task('useref', function() {
	return gulp.src('./app/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
		.pipe(gulp.dest('dist'));
});

gulp.task('clean-dist', function() {
	return del(['./dist/**', '!./dist/']);
})

// Перенос шрифтов
gulp.task("fonts", function() {
	gulp.src("./app/fonts/*")
		.pipe(filter(["*.eot","*.svg","*.ttf","*.woff","*.woff2"]))
		.pipe(gulp.dest("./dist/fonts/"))
});

// Перенос картинок
gulp.task("images", function () {
	return gulp.src("./app/img/**/*")
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest("./dist/img"));
});

// Перенос остальных файлов (favicon и т.д.)
gulp.task("extras", function () {
	return gulp.src(["./app/*.*", "!./app/*.html"])
		.pipe(gulp.dest("./dist"));
});

// Вывод размера папки APP
gulp.task("size-app", function () {
	return gulp.src("app/**/*").pipe(size({title: "APP size: "}));
});

// Вывод размера папки APP
gulp.task("size-app", function () {
	return gulp.src("app/**/*").pipe(size({title: "APP size: "}));
});

// Сборка и вывод размера папки DIST
gulp.task("dist", ["useref", "images", "fonts", "extras", "size-app"], function () {
	return gulp.src("dist/**/*").pipe(size({title: "DIST size: "}));
});


// Default task
gulp.task('default', ['jade', 'compass', 'server', 'watch']);


// Собираем папку DIST - только когда файлы готовы
gulp.task("build", ["clean-dist"], function () {
	gulp.start("dist");
});

