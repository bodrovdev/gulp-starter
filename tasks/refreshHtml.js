const {src, dest} = require('gulp');
const browserSync = require('browser-sync').create();

// Обновление Html в папке билд
module.exports = function refreshHtml() {
	return src('src/**/*.html')
		.pipe(dest('build/'))
		.pipe(browserSync.stream())
};
