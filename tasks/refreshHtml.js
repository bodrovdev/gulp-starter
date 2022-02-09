const {src, dest} = require('gulp');

// Обновление Html в папке билд
module.exports = function refreshHtml(browserSync) {
	return src('src/**/*.html')
		.pipe(dest('build/'))
		.pipe(browserSync.stream())
};
