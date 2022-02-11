const {src, dest} = require('gulp');

// Обновление favicon в папке билд
module.exports = function refreshFavicon(browserSync) {
	return src('src/img/favicon/*.+(png|svg|ico)')
		.pipe(dest('build/img/favicon/'))
		.pipe(browserSync.stream())
};
