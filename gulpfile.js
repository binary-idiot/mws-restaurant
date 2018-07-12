const gulp = require('gulp');
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const images = require('gulp-responsive-images');
const del = require('del');


gulp.task('styles', gulp.series(cleanStyles, compileStyles));

gulp.task('images', gulp.series(cleanImages, resizeImages));

gulp.task('clean', gulp.parallel(cleanImages, cleanStyles));

gulp.task('watch', gulp.parallel(watchStyles, watchImages));

gulp.task('default', gulp.parallel(serve, gulp.series(gulp.parallel('styles', 'images'), 'watch')));


function cleanStyles() {return del(['css/*']);}

function cleanImages() {return del(['images/*']);}

function reload() {return connect.reload();}

function watchStyles() {
	return gulp.watch('src/sass/*')
		.on('all', gulp.series('styles', reload));
}

function watchImages() {
	return gulp.watch('src/images/*')
		.on('all', gulp.series('images', reload));
}

function serve() {
	return connect.server({
		livereload: true
	})
}

function compileStyles() {
	return gulp.src('src/sass/*')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('css'));
}

function resizeImages() {
	return gulp.src('src/img/*')
		.pipe(images({
			'*.jpg':[{
				width: 300,
				suffix: '-small',
				quality: 30
			},
			{
				width: 600,
				suffix: '-medium',
				quality: 30
			},
			{
				width: 800,
				suffix: '-large',
				quality: 30
			}]
		}))
		.pipe(gulp.dest('img'));
}