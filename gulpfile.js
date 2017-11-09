const gulp = require('gulp');

function buildCSS(file) {
  const sass = require('gulp-sass');
  
  return gulp.src(`./client/styles/${file}.scss`)
    .pipe(sass({ outputStyle: 'compressed' })
    .on('error', sass.logError))
    .pipe(gulp.dest('./static/css'))
}

gulp.task('css:main', () => buildCSS('styles'));
gulp.task('css:admin', () => buildCSS('admin'));

gulp.task('fontello', () => gulp
  .src('fontello.json')
  .pipe(require('gulp-fontello')())
  .pipe(gulp.dest('./static/fontello'))
);