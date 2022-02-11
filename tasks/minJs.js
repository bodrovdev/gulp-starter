const {src, dest} = require('gulp');
const babel 			= require('gulp-babel');
const concat 		  = require('gulp-concat');
const terser 			= require('gulp-terser');

// Минификация JavaScript
module.exports = function minJs(browserSync) {
	return src('src/js/**/*.js')
		.pipe(terser())
		.pipe(babel({presets: ['@babel/env']}))
		.pipe(concat('script.min.js'))
		.pipe(dest('build/js'))
		.pipe(browserSync.stream())
};
