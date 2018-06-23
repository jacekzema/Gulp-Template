//Deklaracja zmiennych
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
const babili = require("gulp-babili");
var del = require('del');

var runSequence = require('run-sequence');


//Definicja tasków
gulp.task('browserSync', function () {
    browserSync.init({
      server: {
      baseDir: 'app'
      },
    })
  });

  gulp.task('sass', () => {
    return gulp.src('app/sass/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
      }))
  });

  gulp.task('watch', ['browserSync', 'sass'], () => {
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
  });

  gulp.task('useref', () => {
    return gulp.src('app/*.html')
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
  });

  gulp.task('scripts', function () {
    return gulp.src(['app/js/*.js'])
    .pipe(concat('main.min.js'))
    .pipe(babili({
      mangle: {
        keepClassNames: true
      }
    }))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('dist/js'));
  });

  gulp.task('clean:dist', () => {
    return del.sync('dist');
  });


  gulp.task('default', function (callback) {
    runSequence(['watch', 'sass', 'browserSync'],
      callback
    )
  });

  gulp.task('build', function (callback) {
    runSequence('clean:dist', ['default', 'images', 'fonts'], 'useref', 'scripts',
      callback)
 });
