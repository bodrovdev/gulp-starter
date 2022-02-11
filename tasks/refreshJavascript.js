const {src, dest} = require('gulp');
const concat 			= require('gulp-concat');

// Обновление JavaScript в папке build
module.exports = function refreshJavascript(browserSync) {
	return src('src/js/**/*.js')
		.pipe(concat('script.min.js'))
		.pipe(dest('build/js'))
		.pipe(browserSync.stream())
};
