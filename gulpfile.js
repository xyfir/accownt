var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');
var minify = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util')
var argv = require('yargs').argv;
var gzip = require('gulp-gzip');
var gulp = require('gulp');

/*
	css
	- concats css files
	- minifies / gzip
*/
gulp.task('css', function() {
	var sources = [
		'./css/grid.css', './css/main.css', './css/dashboard.css', './css/step-form.css'
	];
	
	return gulp.src(sources)
		.pipe(concat('style.css'))
		.pipe(minify())
		.pipe(argv.prod ? gzip() : gutil.noop())
		.pipe(gulp.dest('./public/css'));
});

/*
	react
	- bundles React componenents
	- converts JSX -> pure React
	- minifies / gzip
*/
gulp.task('react', function() {
	// Add JSX transformer to Browserify
    var b = require('browserify')(
        './components/' + argv.file + '.jsx', { extensions: '.jsx' }
    );
	b.transform(require('reactify'));
	
	// Bundle React components and minify JS
	return b.bundle()
		.pipe(source(argv.file + '.js'))
		.pipe(streamify(uglify({
			mangle: false,
			compress: {
				unused: false
			}
		}).on('error', gutil.log)))
		.pipe(argv.prod ? gzip() : gutil.noop())
		.pipe(gulp.dest('./public/js/react/'));
});