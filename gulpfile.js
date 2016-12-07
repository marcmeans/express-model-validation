'use strict';
/* eslint no-unused-vars: "off" */
var gulp = require('gulp');
var env = require('gulp-env');
var eslint = require('gulp-eslint');
var ts = require('gulp-typescript');
var tslint = require('tslint');
var program = tslint.createProgram('./tsconfig.json');
var gulpTslint = require('gulp-tslint');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = ts.createProject('tsconfig.json');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var src = 'src/**/*', dest = 'dist';
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
const changed = require('gulp-changed');

var gulpSrc = gulp.src;
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

gulp.task('default', ['serve', 'build'], () => {

});

gulp.task('build', ['lint', 'copy-assets'], () => {
	var tsResult = gulp.src(src + '.ts')
		.pipe(sourcemaps.init())
		.pipe(tsProject());
	return tsResult.js
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dest));
});

gulp.task('copy-assets', ['clean'], () => {
	return gulp
		.src([
			src,
			src + '.d.ts',
			'!' + src + '.ts',
			'package.json',
			'.npmrc',
			'README.md',
			'local.env.json',
			'process.yml'])
		.pipe(changed(dest))
		.pipe(gulp.dest(dest));
});

gulp.task('watch', () => {
	gulp.watch([src + '.ts'], ['build']).on('change', (e) => {
		console.log('TypeScript file ' + e.path + ' has been changed.'
			+ 'Compiling.');
	});
});

gulp.task('eslint', () => {
	return gulp.src('*.js')
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('tslint', () => {
	var tsResult = tsProject.src()
		.pipe(gulpTslint({
			formatter: 'verbose',
			program: program
		}))
		.pipe(gulpTslint.report({
			emitError: false,
			reportLimit: 20
		}));
	return tsResult.js;
});

gulp.task('lint', ['eslint', 'tslint'], () => {
});

gulp.task('test', ['build'], (done) => {
	env({ file: 'local.env.json' });

	return gulp.src('./dist/**/*.js')
		.pipe(mocha({
			ui: 'bdd'
		}))
		.once('error', () => {
			process.exit(1);
		})
		.once('end', () => {
			process.exit();
		});

});

gulp.task('clean', [], () => {
	console.log('Cleaning all files in build folder');
	return gulp.src(dest + '/*', { read: false }).pipe(clean());
});
