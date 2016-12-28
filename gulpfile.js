let gulp = require('gulp'),
	ts = require('gulp-typescript'),
	tslint = require('gulp-tslint'),
	clean = require('gulp-clean'),
	sourcemaps = require('gulp-sourcemaps'),
	mocha = require('gulp-mocha'),
	nodemon = require('gulp-nodemon'),
	plumber = require('gulp-plumber'),
	gutil = require('gulp-util'),
	changed = require('gulp-changed'),
	src = 'src/**/*',
	dest = 'dist',
	gulpSrc = gulp.src,
	tsProject = ts.createProject('tsconfig.json');

gulp.src = function () {
	return gulpSrc.apply(gulp, arguments)
		.pipe(plumber(function (error) {
			// Output an error message
			let msg = 'Error (' + error.plugin + '): ' + error.message;
			gutil.log(gutil.colors.red(msg));
			// emit the end event, to properly end the task
			this.emit('end');
		}));
};


gulp.task('build', ['lint', 'copy-assets'], () => {
	return gulp.src([src + '.ts'])
		.pipe(sourcemaps.init())
		.pipe(tsProject())
		.pipe(sourcemaps.write('.', { sourceRoot: "./src" }))
		.pipe(gulp.dest(dest));
});

gulp.task('copy-assets', ['clean'], () => {
	return gulp
		.src([])
		.pipe(changed(dest))
		.pipe(gulp.dest(dest));
});

gulp.task('lint', function () {
	return gulp.src([
		src + '.ts',
	])
		.pipe(tslint({ formatter: 'verbose' }))
		.pipe(tslint.report());
});

gulp.task('test', ['build'], (done) => {
	return gulp.src('./dist/**/*.js')
		.pipe(mocha({
			ui: 'bdd'
		}))
		.once('error', () => {
			process.exit(1);
			done();
		})
		.once('end', () => {
			process.exit();
			done();
		});
});

gulp.task('clean', [], () => {
	return gulp.src(dest + '/*', { read: false }).pipe(clean());
});
