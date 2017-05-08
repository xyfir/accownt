const gutil = require('gulp-util');
const sass = require('gulp-sass');
const gulp = require('gulp');

const config = require('./config');

const prod = config.environment.type == 'prod';
process.env.NODE_ENV = prod ? 'production' : config.environment.type;

gulp.task('css', () =>
  gulp.src('./client/styles/style.css')
    .pipe(
      sass({ outputStyle: 'compressed' }).on('error', sass.logError)
    )
    .pipe(gulp.dest('./static/css'))
);

gulp.task('client', () => {
  const browserify = require('browserify');
  const streamify = require('gulp-streamify');
  const babelify = require('babelify');
  const uglify = require('gulp-uglify');
  const source = require('vinyl-source-stream');

  const extensions = ['.jsx', '.js'];
  
  const b = browserify(
    './client/components/App.jsx', {
      debug: true, extensions, paths: ['./client']
    }
  );
  b.transform(babelify.configure({
    extensions, presets: ['es2015', 'react']
  }));
  
  return b.bundle()
    .pipe(source('App.js'))
    .pipe(
      prod ? streamify(uglify({
        mangle: false,
        compress: { unused: false }
      }))
      .on('error', gutil.log) : gutil.noop()
    )
    .pipe(gulp.dest('./static/js/'));
});

gulp.task('copy-libs', () =>
  gulp.src([
    './node_modules/sweetalert/dist/sweetalert.min.js'
  ])
  .pipe(gulp.dest('./static/js'))
);

gulp.task('copy-css', () =>
  gulp.src([
    './node_modules/sweetalert/dist/sweetalert.css'
  ])
  .pipe(
    sass({ outputStyle: 'compressed' }).on('error', sass.logError)
  )
  .pipe(gulp.dest('./static/css'))
);

gulp.task('fontello', () =>
  gulp.src('fontello.json')
    .pipe(require('gulp-fontello')())
    .pipe(gulp.dest('./static/fontello'))
);