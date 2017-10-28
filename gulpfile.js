const gulp = require('gulp');

gulp.task('css', () => {
  const sass = require('gulp-sass');
  
  return gulp
    .src('./client/styles/style.css')
    .pipe(sass({ outputStyle: 'compressed' })
    .on('error', sass.logError))
    .pipe(gulp.dest('./static/css'));
});

gulp.task('fontello', () => gulp
  .src('fontello.json')
  .pipe(require('gulp-fontello')())
  .pipe(gulp.dest('./static/fontello'))
);