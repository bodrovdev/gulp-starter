const {src, dest} = require('gulp');
const concat 		  = require('gulp-concat');

// Обновление CSS в папке build
module.exports = function refreshStyle(browserSync) {
	return src('src/scss/**/*.scss')
		.pipe(concat('style.min.css'))
		.pipe(dest('build/css/'))
		.pipe(browserSync.stream())
};
