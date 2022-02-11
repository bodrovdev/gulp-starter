const {src, dest} = require('gulp');
const concat 		  = require('gulp-concat');
const scss  			= require('gulp-sass')(require('sass'));

// Обновление CSS в папке build
module.exports = function refreshStyle(browserSync) {
	return src('src/scss/**/*.scss')
		.pipe(scss())
		.pipe(concat('style.min.css'))
		.pipe(dest('build/css/'))
		.pipe(browserSync.stream())
};
