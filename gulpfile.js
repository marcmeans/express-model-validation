let gulp = require('gulp');
let ts = require('gulp-typescript');
let tslint = require('tslint');
let gulpTslint = require('gulp-tslint');
let clean = require('gulp-clean');
let sourcemaps = require('gulp-sourcemaps');
let mocha = require('gulp-mocha');
let plumber = require('gulp-plumber');
let gutil = require('gulp-util');
let changed = require('gulp-changed');

let src = 'src/**/*',
	dest = 'dist',
	gulpSrc = gulp.src,
	program = tslint.createProgram('./tsconfig.json'),
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
	let tsResult = gulp.src([src + '.ts'])
		.pipe(sourcemaps.init())
		.pipe(tsProject());
	return tsResult.js
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(dest));
});

gulp.task('copy-assets', ['clean'], () => {
	return gulp
		.src([
			src + '*.d.ts',
			'package.json',
			'.npmrc',
			'README.md'])
		.pipe(changed(dest))
		.pipe(gulp.dest(dest));
});

gulp.task('watch', () => {
	gulp.watch([src + '.ts'], ['build']).on('change', (e) => {
		console.log('TypeScript file ' + e.path + ' has been changed.'
			+ 'Compiling.');
	});
});

gulp.task('lint', () => {
	let tsResult = tsProject.src()
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


gulp.task('test', ['build'], (done) => {
	return gulp.src('./dist/**/*.spec.js')
		.pipe(mocha({
			ui: 'bdd'
		}))
		.once('error', () => {
			process.exit(1);
		})
		.once('end', () => {
			process.exit();
			done();
		});

});

gulp.task('clean', [], () => {
	console.log('Cleaning all files in build folder');
	return gulp.src(dest + '/*', { read: false }).pipe(clean());
});
