var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var DEST = './public/';

gulp.task('default', function() {
	gulp.src(DEST + 'src/*.js')
    .pipe(gulp.dest(DEST + 'src/'))
    .pipe(uglify())
    .pipe(rename({ extname: '.js' }))
    .pipe(gulp.dest(DEST + 'src/'));
});
