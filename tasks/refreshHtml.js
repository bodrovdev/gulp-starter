const {src, dest} = require('gulp');

// Обновление HTML в папке build
module.exports = function refreshHtml(browserSync) {
	return src('src/**/*.html')
		.pipe(dest('build/'))
		.pipe(browserSync.stream())
};
