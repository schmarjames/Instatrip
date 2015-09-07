var gulp = require('gulp');
    /*sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    connect = require('gulp-connect');*/

var cors = function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
};

    gulp.task('scripts', function() {
      return gulp.src('js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({ message: 'Scripts task complete' }))
        .pipe(connect.reload());
    });

    gulp.task('copy-ness', function() {
       return gulp.src([
             'bower_components/jquery/*.js',
             'bower_components/underscore/*.js',
             'bower_components/backbone/*.js',
	     'bower_components/backbone.localStorage/*.js',
	     'node_modules/easy-autocomplete/dist/*.js',
	     'node_modules/easy-autocomplete/dist/*.css', 
             'www/lib/bootstrap/dist/css/*.css', 
             'www/lib/jquery/dist/*.js',
             'www/lib/requirejs/*.js'
          ])
          .pipe(gulp.dest('./public/scripts'));
    });

    gulp.task('clean', function(cb) {
        del(['dist/assets/js'], cb)
    });

    gulp.task('connect', function() {
      connect.server({
        root: __dirname,
        livereload: true,
        middleware: function() {
          return [cors];
        }
      });
    });

    // Production default task
    gulp.task('default', function() {
        gulp.start('copy-ness');
    });

    // Default task
    /*gulp.task('default', ['clean', 'connect', 'watch'], function() {
        gulp.start('scripts');
    });*/

    gulp.task('watch', function() {

      // Watch .scss files
      //gulp.watch('css/*.css', ['styles']);

      // Watch .js files
      gulp.watch('js/**/*.js', ['scripts']);

      // Create LiveReload server
      livereload.listen();

      // Watch any files in dist/, reload on change
      gulp.watch(['dist/**']).on('change', livereload.changed);

    });
