var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require("gulp-notify") ;
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var config = {
     sassPath: 'app/scss',
     npmDir: './node_modules' 
}

gulp.task('javascripts', function() { 
    return gulp.src(config.npmDir + '/bootstrap-sass/assets/javascripts/**.*') 
        .pipe(gulp.dest('app/js')); 
})
gulp.task('jquery', function() { 
    return gulp.src(config.npmDir + '/jquery/dist/jquery.js') 
        .pipe(gulp.dest('app/js')); 
})
gulp.task('icons', function() { 
    return gulp.src(config.npmDir + '/font-awesome/fonts/**.*') 
        .pipe(gulp.dest('app/fonts')); 
})
gulp.task('css', function() { 
    return gulp.src('app/scss/**/*.scss')
         .pipe(sass({
             style: 'compressed',
             includePaths: [
                'app/scss',
                config.npmDir + '/bootstrap-sass/assets/stylesheets',
                 config.npmDir + '/font-awesome/scss',
             ]
         }) 
        .on("error", notify.onError(function (error) {
                 return "Error: " + error.message;
             }))) 
         .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream())
})

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
})

gulp.task('serve', ['browserSync','icons','css','javascripts','jquery'], function (){
  gulp.watch(config.sassPath + '/**/*.scss', ['css']); 
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
})

//gulp.task('default', ['bower', 'icons', 'css'])

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
})

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg|PNG)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
})

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})


gulp.task('clean:dist', function() {
  return del.sync('dist');
})
gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['css', 'useref', 'images', 'fonts'],
    callback
  )
})
// gulp.task('build', function (callback) {
//   runSequence('clean:dist', 
//     ['sass', 'useref', 'images', 'fonts'],
//     callback
//   )
// })